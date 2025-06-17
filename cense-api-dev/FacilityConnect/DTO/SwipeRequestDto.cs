namespace FacilityConnect.DTO;

public class SwipeRequestDto
{
    public required string TargetUserId { get; set; }
    public bool IsApproved { get; set; }
}
