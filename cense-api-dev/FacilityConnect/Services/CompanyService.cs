using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;

namespace FacilityConnect.Services;

public class CompanyService(IDbService dbService, ILocationService locationService) : ICompanyService
{
    private readonly IDbService _dbService = dbService;
    private readonly ILocationService _locationService = locationService;

    public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
    {
        return await _dbService.GetAllEntitiesAsync<Company>();
    } 

    public async Task<Company?> GetCompanyByIdAsync(string id)
    {
        return await _dbService.GetEntityAsync<Company>(c => c.Id.ToString() == id);
    }

    public async Task<bool> CompanyExistsAsync(string name, string city)
    {
        return await _dbService.EntityExistsAsync<Company>(c => c.Name == name && c.City == city);
    }

    public async Task<Company?> CreateCompanyAsync(CompanyDto companyDto)
    {
        // Haal coördinaten op via de locatie-service
        var coordinates = await _locationService.ConvertAddressToCoordinatesAsync(
            companyDto.Street,
            companyDto.HouseNumber,
            companyDto.City,
            companyDto.Postalcode,
            "Belgium");

        if (coordinates == null)
            return null;

        // Maak een nieuwe Company aan
        var newCompany = NewCompany(companyDto, coordinates.Value.Latitude, coordinates.Value.Longitude);

        // Voeg toe aan de database via DbService
        await _dbService.AddEntityAsync(newCompany);
        await _dbService.SaveChangesAsync();

        return newCompany;
    }

    private static Company NewCompany(CompanyDto company, double latitude, double longitude)
    {
        return new Company
        {
            Name = company.Name,
            Street = company.Street,
            HouseNumber = company.HouseNumber,
            City = company.City,
            Postalcode = company.Postalcode,
            Country = "Belgium",
            Latitude = latitude,
            Longitude = longitude
        };
    }
}
