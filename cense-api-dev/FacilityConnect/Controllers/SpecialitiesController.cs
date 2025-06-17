using FacilityConnect.Data;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacilityConnect.Controllers;
[Route("api/v1/specialities")]
[ApiController]
[Authorize]
public class SpecialitiesController(ApplicationDbContext context) : BaseController
{
    private readonly ApplicationDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<ResponseModel<IEnumerable<Speciality>>>> GetSpecialities()
    {
        var specialities = await _context.Specialities.ToListAsync();

        var response = new ResponseModel<IEnumerable<Speciality>>
        {
            Success = true,
            Data = specialities
        };

        return Ok(response);
    }
}