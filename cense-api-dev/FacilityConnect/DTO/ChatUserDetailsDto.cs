namespace FacilityConnect.DTO
{
    public class ChatUserDetailsDto
    {
        public required string UserId { get; set; }
        public required string Firstname { get; set; }
        public required string Lastname { get; set; }

        public Boolean IsOnline { get; set; }
        public required string ProfilePicture { get; set; }
        public required string Color { get; set; }
    }
}
