namespace FacilityConnect.DTO;

public class MessageDto
{
    public required string UserId { get; set; }
    public required string RecipientId { get; set; }
    public required string Content { get; set; }
    public required bool IsRead { get; set; }
    public DateTime TimeStamp { get; set; }
    public Guid ChatId { get; set; }
}
