namespace FacilityConnect.Model;

public class UserSpeciality
{
    public string? UserId { get; set; } // Refers to AspNetUsers.Id
    public User? User { get; set; }

    public Guid SpecialityId { get; set; }
    public Speciality? Speciality { get; set; }

    public string? RelationType { get; set; } // 'known', 'needed'
}
