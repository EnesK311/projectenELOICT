using FacilityConnect.Enums;

namespace FacilityConnect.Model;

public class Speciality
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Category Category { get; set; } // 'Energie', 'Juridisch', 'Financieel & beheer'
    public required string SpecialityType { get; set; }
    public ICollection<UserSpeciality>? UserSpecialities { get; set; }
}
