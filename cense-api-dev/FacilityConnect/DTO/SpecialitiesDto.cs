using FacilityConnect.Enums;

namespace FacilityConnect.DTO
{
    public class SpecialitiesDto
    {
        public ICollection<SpecialityInput>? Known { get; set; }
        public ICollection<SpecialityInput>? Needed { get; set; }
    }

    public class SpecialityInput
    {
        public required string Name { get; set; }
        public Category Category { get; set; }
    }
}
