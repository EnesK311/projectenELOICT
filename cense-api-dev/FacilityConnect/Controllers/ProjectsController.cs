using Microsoft.AspNetCore.Mvc;
using FacilityConnect.Model;
using FacilityConnect.Data;
using Microsoft.AspNetCore.Authorization;
using FacilityConnect.DTO;
using Microsoft.EntityFrameworkCore;

namespace FacilityConnect.Controllers
{
    [Route("api/v1/projects")]
    [ApiController]
    [Authorize]
    public class ProjectsController(ApplicationDbContext context) : BaseController
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet("{userId}")]
        public IActionResult GetProjectsByUserId(Guid userId)
        {
            var projects = _context.Projects.Where(p => p.UserId == userId.ToString()).ToList();

            if (projects.Count == 0)
            {
                return NotFound(new ResponseModel<List<Project>>
                {
                    Success = false,
                    Data = null,
                    Error = "No projects found for the given user."
                });
            }

            return Ok(new ResponseModel<List<Project>>
            {
                Success = true,
                Data = projects,
                Error = null
            });
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
        {
            if (ValidateAndGetUserId<object>(out string? userId) is IActionResult validationResult) return validationResult;

            if (projectDto == null)
            {
                return BadRequest(new ResponseModel<Project>
                {
                    Success = false,
                    Data = null,
                    Error = "Project cannot be null."
                });
            }
            var project = new Project
            {
                Name = projectDto.Name,
                Year = projectDto.Year,
                Month = projectDto.Month,
                UserId = userId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectsByUserId), new { userId = project.UserId }, new ResponseModel<Project>
            {
                Success = true,
                Data = project,
                Error = null
            });
        }

        // PUT: api/Projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectDto project)
        {
            if (project == null)
            {
                return BadRequest(new ResponseModel<Project>
                {
                    Success = false,
                    Data = null,
                    Error = "Project cannot be null."
                });
            }

            var existingProject = _context.Projects.FirstOrDefault(p => p.Id == id);
            if (existingProject == null)
            {
                return NotFound(new ResponseModel<Project>
                {
                    Success = false,
                    Data = null,
                    Error = "Project not found."
                });
            }

            // Update the properties
            existingProject.Name = project.Name;
            existingProject.Year = project.Year;
            existingProject.Month = project.Month;

            _context.Projects.Update(existingProject);
            await _context.SaveChangesAsync();

            return Ok(new ResponseModel<Project>
            {
                Success = true,
                Data = existingProject,
                Error = null
            });
        }
        // DELETE: api/v1/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {

            if (ValidateAndGetUserId<object>(out string? userId) is IActionResult validationResult) return validationResult;


            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);


            if (project == null)
            {
                return NotFound(new ResponseModel<Project>
                {
                    Success = false,
                    Data = null,
                    Error = "Project not found or you do not have permission to delete this project."
                });
            }


            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new ResponseModel<Project>
            {
                Success = true,
                Data = project,
                Error = null
            });
        }

    }
}
