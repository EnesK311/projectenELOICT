using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.EntityFrameworkCore;

namespace FacilityConnect.Services;

public class ChatService(ApplicationDbContext context, IDbService dbService, WebSocketManager websocketmanager) : IChatService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IDbService _dbService = dbService;
    private readonly WebSocketManager _websocketmanager = websocketmanager;

    public async Task<List<MessageDto>> GetChatHistoryAsync(string chatId, string userEmail)
    {
        var user = await _dbService.GetUserByEmailAsync(userEmail);
        await _dbService.ValidateUserInChatAsync(user?.Id, chatId);

        var chat = await _context.Chats
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id.ToString() == chatId)
            ?? throw new KeyNotFoundException("Chat not found");

        return chat.Messages
            .OrderBy(m => m.TimeStamp)
            .Select(MapToMessageDto)
            .ToList();
    }

    public async Task<List<ChatWithUsersDto>> GetAllUserChatsAsync(string userEmail)
    {
        var user = await _dbService.GetUserByEmailAsync(userEmail) ?? throw new ArgumentException("User not found");
        var userChats = await _dbService.GetUserChatsAsync(user.Id);

        var chatDtos = await _context.UserChats
            .Where(uc => userChats.Contains(uc.ChatId) && uc.UserId != user.Id)
            .GroupBy(uc => uc.ChatId)
            .Select(g => new ChatWithUsersDto
            {
                ChatId = g.Key.ToString(),
                Users = g.Select(uc => MapToChatUserDetailsDto(uc.User!)).ToList()
            })
            .ToListAsync();

        foreach (var chat in chatDtos)
        {
            chat.LastMessage = await GetLastMessage(Guid.Parse(chat.ChatId));
        }

        return chatDtos;
    }

    public async Task<ChatWithUsersDto> CreateChatAsync(string userEmail, CreateChatDto createChatDto)
    {
        var user = await _dbService.GetUserByEmailAsync(userEmail) ?? throw new ArgumentException("User not found");
        if (user.Id == createChatDto.RecipientId) throw new ArgumentException("Cannot create a chat with yourself");

        if (await _dbService.ChatAlreadyExistsAsync(user.Id, createChatDto.RecipientId)) throw new InvalidOperationException("Chat already exists");

        var newChat = new Chat
        {
            Messages = [],
            UserChats =
            [
                new UserChat { UserId = user.Id },
                new UserChat { UserId = createChatDto.RecipientId }
            ]
        };
        _context.Chats.Add(newChat);
        await _context.SaveChangesAsync();

        var newChatWithUserDto = await GetChatDetailsAsync(newChat.Id, createChatDto.RecipientId);
        await _websocketmanager.TriggerChatToUser(createChatDto.RecipientId, newChatWithUserDto);

        return await GetChatDetailsAsync(newChat.Id, user.Id);
    }

    public async Task<List<UserDto>> GetAvailableUsersAsync(string userId)
    {
        var usersWithChats = await _context.UserChats
            .Where(uc => uc.UserId == userId)
            .Select(uc => uc.ChatId)
            .Distinct()
            .Join(_context.UserChats, chatId => chatId, uc => uc.ChatId, (chatId, uc) => uc.UserId)
            .Distinct()
            .ToListAsync();

        var availableUsersQuery = _context.Users
            .Where(u => u.Id != userId && !usersWithChats.Contains(u.Id))
            .Select(MapToUserDto);

        return  availableUsersQuery.ToList();
    }

    private async Task<ChatWithUsersDto> GetChatDetailsAsync(Guid chatId, string currentUserId)
    {
        var otherUser = await _context.UserChats
           .Where(uc => uc.ChatId == chatId && uc.UserId != currentUserId) 
           .Include(uc => uc.User) 
           .Select(uc => MapToChatUserDetailsDto(uc.User!)) 
           .ToListAsync();

        var lastMessage = await GetLastMessage(chatId);

        return new ChatWithUsersDto
        {
            ChatId = chatId.ToString(),
            Users = otherUser,
            LastMessage = lastMessage
        };
    }

    private async Task<LastMessageDto?> GetLastMessage(Guid chatId)
    {
        var lastMessage = await _context.Messages
            .Where(m => m.ChatId == chatId)
            .OrderByDescending(m => m.TimeStamp)
            .Include(m => m.User)
            .Select(m => new LastMessageDto
            {
                Content = m.MessageContent,
                TimeStamp = m.TimeStamp,
                User = MapToChatUserDetailsDto(m.User!)
            })
            .FirstOrDefaultAsync();

        if (lastMessage == null) return null;

        return lastMessage;
    }

    private static MessageDto MapToMessageDto(Message message)
    {
        return new MessageDto
        {
            UserId = message.UserId,
            RecipientId = message.RecepientId,
            Content = message.MessageContent,
            IsRead = message.IsRead,
            TimeStamp = message.TimeStamp,
            ChatId = message.ChatId
        };
    }

    private static ChatUserDetailsDto MapToChatUserDetailsDto(User? user)
    {
        return new ChatUserDetailsDto
        {
            UserId = user?.Id.ToString() ?? "Unknown",
            Firstname = user?.Firstname ?? "Unknown",
            Lastname = user?.Lastname ?? "Unknown",
            ProfilePicture = user?.ProfilePicture ?? "",
            Color = user?.Color ?? ""
        };
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Firstname = user.Firstname ?? "Unknown",
            Lastname = user.Lastname ?? "Unknown",
            Bio = user.Bio,
            Age = user.Age,
            ProfilePicture = user.ProfilePicture,
            FunctionTitle = user.FunctionTitle,
            IsOnline = user.IsOnline
        };
    }

    public async Task<List<UnreadMessageDto>> GetUnreadMessagesAsync(string userEmail)
    {
        var user = await _dbService.GetUserByEmailAsync(userEmail);

        var unreadMessages = await GetUnreadMessagesForUserAsync(user.Id);

        var result = unreadMessages
            .GroupBy(msg => msg.ChatId)
            .Select(group => new UnreadMessageDto
            {
                ChatId = group.Key.ToString(),
                UnreadCount = group.Count()
            })
            .ToList();

        return result;
    }

    public async Task<IEnumerable<Message>> GetUnreadMessagesForUserAsync(string userId)
    {
        return await _context.Messages
            .Where(m => m.RecepientId == userId && !m.IsRead)
            .ToListAsync();
    }


}
