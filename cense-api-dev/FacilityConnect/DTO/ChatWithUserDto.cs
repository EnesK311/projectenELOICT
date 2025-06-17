namespace FacilityConnect.DTO
{
    public class ChatWithUsersDto
    {
        public required string ChatId { get; set; }
        public string? ChatName { get; set; }
        public required List<ChatUserDetailsDto> Users { get; set; }
        public LastMessageDto? LastMessage { get; set; }
    }
}

