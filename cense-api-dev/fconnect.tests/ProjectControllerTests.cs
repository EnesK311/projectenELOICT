using FacilityConnect.Controllers;
using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace fconnect.tests
{
    public class ProjectControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Gebruik een unieke database-naam per test
                .Options;

            return new ApplicationDbContext(options);
        }
        [Fact]
        public void GetProjectsByUserId_ShouldReturnProjects()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userId = Guid.NewGuid(); // Gebruik een GUID voor UserId

            context.Projects.AddRange(
                new Project { Id = Guid.NewGuid(), Name = "Project 1", UserId = userId.ToString(), Year = 2024, Month = 12 },
                new Project { Id = Guid.NewGuid(), Name = "Project 2", UserId = userId.ToString(), Year = 2024, Month = 11 }
            );
            context.SaveChanges();

            var controller = new ProjectsController(context);

            // Mock the HttpContext to ensure a user is available
            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()) // Simuleer gebruiker met de juiste UserId
    }));
            controller.ControllerContext = new ControllerContext() { HttpContext = httpContext };

            // Act
            var result = controller.GetProjectsByUserId(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ResponseModel<List<Project>>>(okResult.Value);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal(2, response.Data.Count);
            Assert.Contains(response.Data, p => p.Name == "Project 1");
            Assert.Contains(response.Data, p => p.Name == "Project 2");
        }


        [Fact]
        public void GetProjectsByUserId_ShouldReturnNotFound_WhenNoProjectsExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ProjectsController(context);

            var userId = Guid.NewGuid(); // Gebruik een GUID
                                         // Mock the HttpContext to ensure a user is available
            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()) // Simuleer gebruiker met een GUID
    }));
            controller.ControllerContext = new ControllerContext() { HttpContext = httpContext };

            // Act
            var result = controller.GetProjectsByUserId(userId); // Gebruik dezelfde GUID

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<ResponseModel<List<Project>>>(notFoundResult.Value);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.Equal("No projects found for the given user.", response.Error);
        }



        [Fact]
        public async Task CreateProject_ShouldAddProject()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ProjectsController(context);

            // Mock the User property
            var userId = Guid.NewGuid().ToString(); // Simuleer een UserId
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userId), // Claim voor UserId
        new Claim(ClaimTypes.Name, "testuser@example.com") // Claim voor UserEmail
    };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            // Koppel de gemockte User aan de controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            var newProject = new ProjectDto
            {
                Name = "Project A",
                Year = 2024,
                Month = 1
            };

            // Act
            var result = await controller.CreateProject(newProject);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var response = Assert.IsType<ResponseModel<Project>>(createdResult.Value);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal("Project A", response.Data.Name);
            Assert.Equal(2024, response.Data.Year);
            Assert.Equal(1, response.Data.Month);

            Assert.Single(context.Projects.ToList());
        }


        [Fact]
        public async Task UpdateProject_ShouldModifyExistingProject()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var projectId = Guid.NewGuid(); // Genereer een GUID voor Project Id
            var userId = Guid.NewGuid();    // Genereer een GUID voor UserId
            context.Projects.Add(new Project { Id = projectId, Name = "Project A", UserId = userId.ToString() });
            await context.SaveChangesAsync();

            var controller = new ProjectsController(context);
            var updatedProjectDto = new UpdateProjectDto
            {
                Name = "Updated Project A",
                Year = 2023,
                Month = 12,

            };

            // Act
            var result = await controller.UpdateProject(projectId, updatedProjectDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ResponseModel<Project>>(okResult.Value);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal("Updated Project A", response.Data.Name);
            Assert.Equal(2023, response.Data.Year);
        }

        [Fact]
        public async Task UpdateProject_ShouldReturnNotFound_WhenProjectDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ProjectsController(context);
            var projectId = Guid.NewGuid(); // Genereer een GUID voor Project Id
            var userId = Guid.NewGuid();    // Genereer een GUID voor UserId
            var updatedProjectDto = new UpdateProjectDto
            {
                Name = "Updated Project A",
                Year = 2023,
                Month = 12,

            };

            // Act
            var result = await controller.UpdateProject(projectId, updatedProjectDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<ResponseModel<Project>>(notFoundResult.Value);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.Equal("Project not found.", response.Error);
        }

        [Fact]
        public async Task DeleteProject_ShouldRemoveProject_WhenProjectExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var projectId = Guid.NewGuid();
            var userId = Guid.NewGuid().ToString();

            context.Projects.Add(new Project { Id = projectId, Name = "Test Project", UserId = userId });
            await context.SaveChangesAsync();

            var controller = new ProjectsController(context);

            // Mock de HttpContext en stel de ingelogde gebruiker in
            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] {
        new Claim(ClaimTypes.NameIdentifier, userId)
    }));
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            var result = await controller.DeleteProject(projectId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ResponseModel<Project>>(okResult.Value);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal("Test Project", response.Data.Name);
            Assert.Null(response.Error);

            // Controleer of het project is verwijderd uit de database
            Assert.Empty(context.Projects.Where(p => p.Id == projectId));
        }
        [Fact]
        public async Task DeleteProject_ShouldReturnNotFound_WhenProjectDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var projectId = Guid.NewGuid();
            var userId = Guid.NewGuid().ToString();

            var controller = new ProjectsController(context);

            // Mock de HttpContext en stel de ingelogde gebruiker in
            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] {
        new Claim(ClaimTypes.NameIdentifier, userId)
    }));
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            var result = await controller.DeleteProject(projectId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<ResponseModel<Project>>(notFoundResult.Value);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.Equal("Project not found or you do not have permission to delete this project.", response.Error);
        }







    }
}
