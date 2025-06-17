namespace FacilityConnect.Model;

public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required int Postalcode { get; set; }
    public required string Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public ICollection<User>? Users { get; set; }
}
