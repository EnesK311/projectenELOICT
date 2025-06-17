namespace FacilityConnect.Model;

public class UserChat
{
    public string? UserId { get; set; } // Refers to AspNetUsers.Id
    public User? User { get; set; }

    public Guid ChatId { get; set; }

    public Boolean IsOpen { get; set; }

    public Chat? Chat { get; set; }
}
