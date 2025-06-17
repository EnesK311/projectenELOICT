using FacilityConnect.Controllers;
using FacilityConnect.Data;
using FacilityConnect.Enums;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace fconnect.tests
{
    public class SpecialitiesControllerTests
    {
        private readonly SpecialitiesController _controller;
        private readonly ApplicationDbContext _context;

        // Constructor om de database en controller in te stellen voor elke test
        public SpecialitiesControllerTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_" + Guid.NewGuid())
                .Options;

            _context = new ApplicationDbContext(options);

            // Voeg wat testdata toe aan de in-memory database
            _context.Specialities.AddRange(new List<Speciality>
            {
                new() { Id = Guid.NewGuid(), Category = Category.Energie, SpecialityType = "Type1" },
                new() { Id = Guid.NewGuid(), Category = Category.Juridisch, SpecialityType = "Type2" }
            });
            _context.SaveChanges();

            // Stel de controller in met de context
            _controller = new SpecialitiesController(_context);
        }

        [Fact]
        public async Task GetSpecialities_ReturnsOkResult_WithListOfSpecialities()
        {
            // Act
            var result = await _controller.GetSpecialities();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ResponseModel<IEnumerable<Speciality>>>(okResult.Value);
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.NotEmpty(response.Data);
            Assert.Equal(2, response.Data.Count());

            // Controleer de inhoud van de specialismen
            var specialities = response.Data.ToList();
            Assert.Contains(specialities, s => s.Category == Category.Energie && s.SpecialityType == "Type1");
            Assert.Contains(specialities, s => s.Category == Category.Juridisch && s.SpecialityType == "Type2");
        }

        [Fact]
        public async Task GetSpecialities_ReturnsEmptyList_WhenNoSpecialitiesExist()
        {
            // Arrange: Maak een nieuwe context met geen specialismen
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "EmptyTestDb_" + Guid.NewGuid())
                .Options;

            var emptyContext = new ApplicationDbContext(options);
            var emptyController = new SpecialitiesController(emptyContext);

            // Act
            var result = await emptyController.GetSpecialities();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ResponseModel<IEnumerable<Speciality>>>(okResult.Value);
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Empty(response.Data);
        }
    }
}

