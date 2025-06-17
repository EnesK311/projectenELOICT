namespace FacilityConnect.DTO
{
    public class GetUserDTO
    {
        public string? Term { get; set; }
        public double? Distance { get; set; }
        public List<string>? Knowledge { get; set; } 
        public string? FunctionTitle { get; set; }
        public int? Experience { get; set; }
        public string? Sort { get; set; }
        public bool IsSwipe { get; set; }
    }
}
