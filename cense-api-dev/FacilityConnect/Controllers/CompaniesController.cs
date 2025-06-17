using Microsoft.AspNetCore.Mvc;
using FacilityConnect.Model;
using FacilityConnect.DTO;
using Microsoft.AspNetCore.Authorization;
using FacilityConnect.Interfaces;

namespace FacilityConnect.Controllers;

[Route("api/v1/companies")]
[ApiController]
[Authorize]
public class CompaniesController(ICompanyService companyService) : BaseController
{
    private readonly ICompanyService _companyService = companyService;

    [HttpGet]
    public async Task<IActionResult> GetCompanies()
    {
        if (ValidateAndGetUserId<List<Company>>(out string? userId) is IActionResult validationResult) return validationResult;

        var companies = await _companyService.GetAllCompaniesAsync();
        return Ok(new ResponseModel<List<Company>>
        {
            Success = true,
            Data = companies.ToList()
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompanyById(string id)
    {
        if (ValidateAndGetUserId<object>(out string? userId) is IActionResult validationResult) return validationResult;

        var company = await _companyService.GetCompanyByIdAsync(id);

        if (company == null)
        {
            return NotFound(new ResponseModel<object>
            {
                Success = false,
                Error = "Company not found."
            });
        }

        return Ok(new ResponseModel<Company>
        {
            Success = true,
            Data = company
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompany([FromBody] CompanyDto company)
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        bool companyExists = await _companyService.CompanyExistsAsync(company.Name, company.City);

        if (companyExists)
        {
            return Conflict(new ResponseModel<object>
            {
                Success = false,
                Error = "Company already exists."
            });
        }

        var newCompany = await _companyService.CreateCompanyAsync(company);

        if (newCompany == null)
        {
            return BadRequest(new ResponseModel<object>
            {
                Success = false,
                Error = "Unable to retrieve coordinates for the provided address."
            });
        }

        return CreatedAtAction(nameof(GetCompanyById), new { id = newCompany.Id }, new ResponseModel<Company>
        {
            Success = true,
            Data = newCompany
        });
    }
}