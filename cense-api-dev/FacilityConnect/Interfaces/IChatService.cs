using FacilityConnect.DTO;

namespace FacilityConnect.Interfaces;

public interface IChatService
{
    Task<List<MessageDto>> GetChatHistoryAsync(string chatId, string userEmail);
    Task<List<ChatWithUsersDto>> GetAllUserChatsAsync(string userEmail);
    Task<ChatWithUsersDto> CreateChatAsync(string userEmail, CreateChatDto createChatDto);
    Task<List<UserDto>> GetAvailableUsersAsync(string userId);
    Task<List<UnreadMessageDto>> GetUnreadMessagesAsync(string userEmail);

}
