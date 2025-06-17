namespace FacilityConnect.DTO
{
    public class UserDto
    {
        public required string Id { get; set; }
        public string? Email { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Bio { get; set; }
        public int? Age { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Color { get; set; }
        public string? FunctionTitle { get; set; }
        public int? Experience {  get; set; }
        public Boolean? IsOnline { get; set; }
        public CompanyDto? Company { get; set; }
        public SpecialitiesDto? Specialities { get; set; }
        public List<ProjectDto>? Projects { get; set; }
    }
}
