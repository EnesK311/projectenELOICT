namespace FacilityConnect.Model;

public class Project
{
    public Guid Id { get; set; } = new Guid();

    public required string Name { get; set; }

    public int? Year { get; set; }

    public int? Month { get; set; }

    // Foreign Key
    public string UserId { get; set; }

    public User? User { get; set; }
}
