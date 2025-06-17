using FacilityConnect.Model;

namespace FacilityConnect.DTO
{
    public class LastMessageDto
    {
        public required string Content { get; set; }
        public DateTime TimeStamp { get; set; }
        public ChatUserDetailsDto? User { get; set; }
    }
}
