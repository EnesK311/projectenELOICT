using FacilityConnect.DTO;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using FacilityConnect.Data;
using FacilityConnect.Model;
using System.Text.Json.Nodes;

namespace FacilityConnect.Services;

public class WebSocketHandler(WebSocketManager webSocketManager, ApplicationDbContext applicationDbContext)
{
    private readonly WebSocketManager _webSocketManager = webSocketManager;
    private readonly ApplicationDbContext _context = applicationDbContext;

    public async Task HandleConnectionAsync(string userEmail, WebSocket webSocket)
    {
        string? userId = await _context.Users.Where(u => u.Email == userEmail).Select(u => u.Id).FirstOrDefaultAsync() ?? throw new UnauthorizedAccessException("Unauthorized");
        _webSocketManager.AddConnection(userId, webSocket);

        await _webSocketManager.UpdateUserStatus(userId, true);
        await WebsocketCommunicationHandler(userId, webSocket);
    }

    private async Task WebsocketCommunicationHandler(string userId, WebSocket webSocket)
    {
        byte[] buffer = new byte[1024 * 4];

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    await HandleTextMessage(userId, buffer, result.Count);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        catch (WebSocketException ex)
        {
            throw new Exception($"WebSocketException for user {userId}: {ex.Message}");
        }
        finally
        {
            _webSocketManager.RemoveConnection(userId);
            await _webSocketManager.UpdateUserStatus(userId, false);
        }
    }

    private async Task HandleTextMessage(string userId, byte[] buffer, int count)
    {
        string messageJson = Encoding.UTF8.GetString(buffer, 0, count);
        var message = JsonSerializer.Deserialize<WebSocketMessage<JsonObject>>(messageJson) ?? throw new Exception("Message deserialization failed.");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new Exception("Sender not found.");

        var messageHandlers = new Dictionary<string, Func<Task>>
        {
            ["message"] = async () =>
            {
                var messageDto = JsonSerializer.Deserialize<MessageDto>(message.Payload.ToString()) ?? throw new Exception("Message deserialization failed.");
                await _webSocketManager.SaveMessageToDatabase(messageDto.UserId, messageDto.Content, messageDto.RecipientId);
                await _webSocketManager.ResetTypingStatus(messageDto.UserId, messageDto.RecipientId);
                await _webSocketManager.TriggerMessageToUser(messageDto);
            },
            ["open-chat"] = async () =>
            {
                var openChatInfo = JsonSerializer.Deserialize<OpenChatDto>(message.Payload.ToString())?? throw new Exception("Open chat deserialization failed.");
                await _webSocketManager.SetChatStatus(userId, openChatInfo.ChatId, true);
                await _webSocketManager.MarkMessagesAsRead(userId, openChatInfo.RecipientUser);
                await _webSocketManager.SendChatRead(openChatInfo.RecipientUser, openChatInfo.ChatId);
            },
            ["close-chat"] = async () =>
            {
                var openChatInfo = JsonSerializer.Deserialize<OpenChatDto>(message.Payload.ToString()) ?? throw new Exception("Close chat deserialization failed.");
                await _webSocketManager.SetChatStatus(userId, openChatInfo.ChatId, false);
            },
            ["typing"] = async () =>
            {
                var typingInfo = JsonSerializer.Deserialize<TypingDto>(message.Payload.ToString()) ?? throw new Exception("Typing deserialization failed.");
                await _webSocketManager.SendTypingStatus(userId, typingInfo.RecipientId, typingInfo.IsTyping);
            }
        };

        if (!messageHandlers.TryGetValue(message.Type, out var handler))
            throw new Exception($"Unknown message type: {message.Type}");

        await handler();
    }
}