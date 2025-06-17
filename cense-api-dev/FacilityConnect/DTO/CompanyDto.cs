﻿namespace FacilityConnect.DTO
{
    public class CompanyDto
    {
        public Guid? Id { get; set; }
        public required string Name { get; set; }
        public required string Street { get; set; }
        public required string HouseNumber { get; set; }
        public required string City { get; set; }
        public required int Postalcode { get; set; }
        public required string Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
