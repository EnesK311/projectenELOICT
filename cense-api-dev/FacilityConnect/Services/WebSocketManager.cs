using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace FacilityConnect.Services;

public class WebSocketManager(ConcurrentDictionary<string, WebSocket> activeConnections, ApplicationDbContext applicationDbContext)
{
    private readonly ConcurrentDictionary<string, WebSocket> _activeConnections = activeConnections;
    private readonly ApplicationDbContext _context = applicationDbContext;

    public void AddConnection(string userId, WebSocket webSocket) => _activeConnections[userId] = webSocket;

    public void RemoveConnection(string userId) => _activeConnections.TryRemove(userId, out _);

    public WebSocket GetConnection(string userId) => _activeConnections.TryGetValue(userId, out var webSocket) ? webSocket : throw new Exception("Could not make Connection");

    public async Task SaveMessageToDatabase(string senderId, string messageContent, string recipientId)
    {
        var sender = await _context.Users.FirstOrDefaultAsync(u => u.Id == senderId) ?? throw new Exception("Sender not found.");

        var chat = await _context.Chats.Where(c => c.UserChats != null && 
                    c.UserChats.Any(uc => uc.UserId == senderId) && 
                    c.UserChats.Any(uc => uc.UserId == recipientId))
                    .FirstOrDefaultAsync() ?? await CreateNewChat(senderId, recipientId);

        await AddUserChatsToChat(senderId, recipientId, chat);
        await SaveMessage(senderId, recipientId, messageContent, chat);
    }

    private async Task<Chat> CreateNewChat(string senderId, string recipientId)
    {
        var newChat = new Chat { Messages = [] };

        _context.Chats.Add(newChat);
        await _context.SaveChangesAsync();

        newChat.UserChats =
        [
            new UserChat { UserId = senderId, ChatId = newChat.Id },
            new UserChat { UserId = recipientId, ChatId = newChat.Id }
        ];

        _context.Chats.Update(newChat);
        await _context.SaveChangesAsync();

        return newChat;
    }

    private async Task AddUserChatsToChat(string senderId, string recipientId, Chat chat)
    {
        var userChatSender = await _context.UserChats.FirstOrDefaultAsync(uc => uc.UserId == senderId && uc.ChatId == chat.Id);
        var userChatRecipient = await _context.UserChats.FirstOrDefaultAsync(uc => uc.UserId == recipientId && uc.ChatId == chat.Id);

        if (userChatSender == null) _context.UserChats.Add(new UserChat { UserId = senderId, Chat = chat });
        if (userChatRecipient == null) _context.UserChats.Add(new UserChat { UserId = recipientId, Chat = chat });

        await _context.SaveChangesAsync();
    }

    private async Task SaveMessage(string senderId, string recipientId, string messageContent, Chat chat)
    {
        var message = new Message
        {
            UserId = senderId,
            RecepientId = recipientId,
            MessageContent = messageContent,
            IsRead = false,
            TimeStamp = DateTime.UtcNow,
            Chat = chat
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
    }

    public async Task MarkMessagesAsRead(string userId, string otherUserId)
    {
        var chat = await _context.Chats
            .Include(c => c.Messages)
            .Where(c => c.UserChats.Any(uc => uc.UserId == userId) &&
                        c.UserChats.Any(uc => uc.UserId == otherUserId))
            .FirstOrDefaultAsync() ?? throw new Exception("No chat found between the given users.");

        var unreadMessages = chat.Messages
            .Where(m => !m.IsRead)
            .ToList();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task TriggerMessageToUser(MessageDto messageDto)
    {
        if (_activeConnections.TryGetValue(messageDto.RecipientId, out var recipientSocket))
        {

            var userChat = await _context.UserChats
            .FromSqlRaw(@"
                SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
                SELECT * FROM UserChats WHERE UserId = {0} AND ChatId = {1};
                SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            ", messageDto.RecipientId, messageDto.ChatId)
            .AsNoTracking()
            .ToListAsync();


            if (userChat[0] != null && userChat[0].IsOpen)
            {
                await MarkMessagesAsRead(messageDto.UserId, messageDto.RecipientId);
                await SendChatRead(messageDto.UserId, messageDto.ChatId.ToString());
                messageDto.IsRead = true;
            }
            else
            {
                messageDto.IsRead = false;
            }

        }

        await SendMessageAsync(messageDto.RecipientId, "message", messageDto);
    }

    public async Task TriggerChatToUser(string recipientId, ChatWithUsersDto chatDto)
    {
        var mapChat = new
        {
            chatId = chatDto.ChatId,
            chatName = chatDto.ChatName,

            users = chatDto.Users.Select(u => 
            new { 
                userId= u.UserId,
                firstname= u.Firstname,
                lastname= u.Lastname,
                profilePicture= u.ProfilePicture,
                isOnline = u.IsOnline,
                color = u.Color
            }),

            lastMessage = chatDto.LastMessage
        };

        await SendMessageAsync(recipientId, "chat", mapChat);
    }

    public async Task SendMessageAsync<T>(string recipientId, string messageType, T payload)
    {
        if (_activeConnections.TryGetValue(recipientId, out var webSocket))
        {
            var message = new WebSocketMessage<T>(messageType, payload);
            string jsonMessage = JsonSerializer.Serialize(message);
            byte[] buffer = Encoding.UTF8.GetBytes(jsonMessage);
            var segment = new ArraySegment<byte>(buffer);

            await webSocket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    public async Task UpdateUserStatus(string userId, bool status)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new Exception("User not found.");
        user.IsOnline = status;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        await NotifyStatusChange(userId, status);
    }

    public async Task NotifyStatusChange(string userId, bool isOnline)
    {
        var statusChangePayload = new
        {
            UserId = userId,
            IsOnline = isOnline
        };

        foreach (var connection in _activeConnections)
        {
            if (connection.Key != userId)
            {
                await SendMessageAsync(connection.Key, "user-status", statusChangePayload);
            }
        }
    }

    public async Task SendTypingStatus(string senderId, string recipientId, bool isTyping)
    {
        await SendMessageAsync(
        recipientId,
        "typing-status",
        new
        {
            SenderId = senderId,
            IsTyping = isTyping
        });
    }

    public async Task ResetTypingStatus(string senderId, string recipientId)
    {
        await SendMessageAsync(
            recipientId,
            "typing-status",
            new
            {
                SenderId = senderId,
                IsTyping = false
            }
        );
    }

    public async Task SetChatStatus(string userId, string chatId, bool chatStatus)
    {
        var userChat = await _context.UserChats
            .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.ChatId.ToString() == chatId);

        if (userChat == null)
        {
            throw new Exception("UserChat not found.");
        }

        userChat.IsOpen = chatStatus;

        _context.UserChats.Update(userChat);
        await _context.SaveChangesAsync();
    }


    public async Task SendChatRead(string recipientId, string chatId)
    {
        await SendMessageAsync(recipientId, "chat-read", new { ChatId= chatId});
    }

}

