namespace FacilityConnect.Model;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; } // Refers to AspNetUsers.Id
    public required string RecepientId { get; set; }
    public bool IsRead { get; set; } = false;
    public User? User { get; set; }
    public required string MessageContent { get; set; }
    public DateTime TimeStamp { get; set; }
    public Guid ChatId { get; set; }
    public required Chat Chat { get; set; }
}
