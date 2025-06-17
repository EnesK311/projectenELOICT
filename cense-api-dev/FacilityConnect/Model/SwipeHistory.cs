namespace FacilityConnect.Model;

public class SwipeHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? UserId { get; set; }
    public User? User { get; set; }
    public string? TargetUserId { get; set; }
    public User? TargetUser { get; set; }
    public bool IsApproved { get; set; }
    public DateTime ActionDate { get; set; }
}
