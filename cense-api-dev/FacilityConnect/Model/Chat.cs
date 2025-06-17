namespace FacilityConnect.Model;

public class Chat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ICollection<UserChat>? UserChats { get; set; }
    public required ICollection<Message> Messages { get; set; }
}
