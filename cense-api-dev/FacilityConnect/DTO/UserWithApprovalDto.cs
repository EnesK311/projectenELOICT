namespace FacilityConnect.DTO
{
    public class UserWithApprovalDto
    {
        public UserDto? User { get; set; }
        public bool IsApproved { get; set; }
    }
}
