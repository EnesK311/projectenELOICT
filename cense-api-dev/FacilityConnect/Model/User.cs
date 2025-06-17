using Microsoft.AspNetCore.Identity;

namespace FacilityConnect.Model;

public class User : IdentityUser
{
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public string? Bio { get; set; }
    public int? Age { get; set; }
    public string? ProfilePicture { get; set; }
    public string? Color { get; set; }
    public string? FunctionTitle { get; set; }
    public int? Experience {  get; set; } 
    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }
    public Boolean IsOnline { get; set; } = false;
    public ICollection<UserSpeciality>? UserSpecialities { get; set; }
    public ICollection<UserChat>? UserChats { get; set; }
    public ICollection<Project>? Projects { get; set; }
}
