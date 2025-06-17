using FacilityConnect.DTO;
using FacilityConnect.Model;

namespace FacilityConnect.Interfaces;

public interface ICompanyService
{
    Task<IEnumerable<Company>> GetAllCompaniesAsync();
    Task<Company?> GetCompanyByIdAsync(string id);
    Task<bool> CompanyExistsAsync(string name, string city);
    Task<Company?> CreateCompanyAsync(CompanyDto company);
}
