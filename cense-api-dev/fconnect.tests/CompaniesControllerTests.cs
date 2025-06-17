using FacilityConnect.Controllers;
using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace fconnect.tests
{
    public class CompaniesControllerTests
    {
        private readonly CompaniesController _controller;
        private readonly Mock<ICompanyService> _companyServiceMock;
        private readonly Mock<ILocationService> _locationServiceMock;

        public CompaniesControllerTests()
        {
            _locationServiceMock = new Mock<ILocationService>();

            // Stel de mock voor de ICompanyService in
            _companyServiceMock = new Mock<ICompanyService>();

            // Mock de User voor de controller
            var mockUser = new Mock<System.Security.Claims.ClaimsPrincipal>();
            mockUser.Setup(u => u.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier))
                    .Returns(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, "TestUserId"));

            // Maak de controller aan met de mocks
            _controller = new CompaniesController(_companyServiceMock.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = new DefaultHttpContext() { User = mockUser.Object }
                }
            };
        }

        [Fact]
        public async Task CreateCompany_ReturnsCreatedResult_WhenCompanyIsCreated()
        {
            // Arrange
            var companyDto = new CompanyDto
            {
                Name = "New Company",
                Street = "Biesbilkske",
                HouseNumber = "22",
                City = "Lievegem",
                Postalcode = 9930,
                Country = "Belgium"
            };

            // Mock de locatie service zodat deze altijd coördinaten retourneert
            _locationServiceMock.Setup(service => service.ConvertAddressToCoordinatesAsync(
                companyDto.Street,
                companyDto.HouseNumber,
                companyDto.City,
                companyDto.Postalcode,
                companyDto.Country))
                .ReturnsAsync((1.234, 5.678));  // Mock coördinaten

            // Mock de CreateCompanyAsync om een nieuw bedrijf terug te geven
            var newCompany = new Company
            {
                Id = Guid.NewGuid(),
                Name = companyDto.Name,
                Street = companyDto.Street,
                HouseNumber = companyDto.HouseNumber,
                City = companyDto.City,
                Postalcode = companyDto.Postalcode,
                Country = companyDto.Country,
                Latitude = 1.234,
                Longitude = 5.678
            };

            _companyServiceMock.Setup(service => service.CreateCompanyAsync(It.IsAny<CompanyDto>()))
                .ReturnsAsync(newCompany);

            // Act
            var result = await _controller.CreateCompany(companyDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);  // Controleer op CreatedAtActionResult
            var responseModel = Assert.IsType<ResponseModel<Company>>(createdResult.Value);

            Assert.True(responseModel.Success);
            Assert.NotNull(responseModel.Data);
            Assert.Equal(newCompany.Name, responseModel.Data.Name);
            Assert.Equal(newCompany.Latitude, responseModel.Data.Latitude);
            Assert.Equal(newCompany.Longitude, responseModel.Data.Longitude);
        }


        [Fact]
        public async Task CreateCompany_ReturnsConflictResult_WhenCompanyAlreadyExists()
        {
            // Arrange
            var companyDto = new CompanyDto
            {
                Name = "Existing Company",
                Street = "Test Street",
                HouseNumber = "1",
                City = "Test City",
                Postalcode = 1000,
                Country = "Belgium"
            };

            // Mock de CompanyExistsAsync methode om te simuleren dat het bedrijf al bestaat
            _companyServiceMock.Setup(service => service.CompanyExistsAsync(companyDto.Name, companyDto.City))
                .ReturnsAsync(true);  // Het bedrijf bestaat al

            // Act
            var result = await _controller.CreateCompany(companyDto);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);  // Controleer direct op ConflictObjectResult
            var responseModel = Assert.IsType<ResponseModel<object>>(conflictResult.Value);
            Assert.False(responseModel.Success);
            Assert.Equal("Company already exists.", responseModel.Error);
        }



        [Fact]
        public async Task GetCompanyById_ReturnsNotFound_WhenCompanyDoesNotExist()
        {
            // Arrange
            var nonExistentCompanyId = Guid.NewGuid();  // Dit ID bestaat niet in de database

            // Mock de GetCompanyByIdAsync methode zodat deze null retourneert voor een niet bestaand bedrijf
            _companyServiceMock.Setup(service => service.GetCompanyByIdAsync(nonExistentCompanyId.ToString()))
                .ReturnsAsync((Company?)null);  // De returnwaarde is nullable

            // Act
            var result = await _controller.GetCompanyById(nonExistentCompanyId.ToString());

            // Assert
            // Controleer of result niet null is voordat je verder gaat
            Assert.NotNull(result);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);  // Controleer het resultaat is een NotFoundObjectResult
            var responseModel = Assert.IsType<ResponseModel<object>>(notFoundResult.Value);  // Controleer het type van de response

            Assert.False(responseModel.Success);
            Assert.Equal("Company not found.", responseModel.Error);
        }


        [Fact]
        public async Task GetCompanies_ReturnsOkResult_WithListOfCompanies()
        {
            // Arrange
            var companies = new List<Company>
    {
        new Company
        {
            Id = Guid.NewGuid(),
            Name = "Company 1", Street = "Street 1",
            HouseNumber = "1",
            City = "City 1",
            Postalcode = 1000,
            Country = "Country 1",
            Latitude = 1.234,
            Longitude = 5.678
        },
        new Company
        {
            Id = Guid.NewGuid(),
            Name = "Company 2",
            Street = "Street 2",
            HouseNumber = "2",
            City = "City 2",
            Postalcode = 2000,
            Country = "Country 2",
            Latitude = 2.345,
        }
    };

            // Mock de GetAllCompaniesAsync methode zodat deze de lijst van bedrijven retourneert
            _companyServiceMock.Setup(service => service.GetAllCompaniesAsync())
                .ReturnsAsync(companies);

            // Act
            var result = await _controller.GetCompanies();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);  // Controleer op OkObjectResult
            var responseModel = Assert.IsType<ResponseModel<List<Company>>>(okResult.Value);

            Assert.True(responseModel.Success);
            Assert.NotNull(responseModel.Data);
            Assert.Equal(companies.Count, responseModel.Data.Count);
            Assert.Equal(companies[0].Name, responseModel.Data[0].Name);
            Assert.Equal(companies[1].Name, responseModel.Data[1].Name);
        }


        // regression tests

        [Fact]
        public async Task CreateCompany_ReturnsCreatedResult_WhenCompanyIsCreated_RegressionTest()
        {
            // Arrange
            var companyDto = new CompanyDto
            {
                Name = "Test Company",
                Street = "Main Street",
                HouseNumber = "100",
                City = "Test City",
                Postalcode = 1234,
                Country = "Test Country"
            };

            // Mock de locatie service zodat deze altijd coördinaten retourneert
            _locationServiceMock.Setup(service => service.ConvertAddressToCoordinatesAsync(
                companyDto.Street,
                companyDto.HouseNumber,
                companyDto.City,
                companyDto.Postalcode,
                companyDto.Country))
                .ReturnsAsync((1.234, 5.678));  // Mock coördinaten

            // Mock de CreateCompanyAsync om een nieuw bedrijf terug te geven
            var newCompany = new Company
            {
                Id = Guid.NewGuid(),
                Name = companyDto.Name,
                Street = companyDto.Street,
                HouseNumber = companyDto.HouseNumber,
                City = companyDto.City,
                Postalcode = companyDto.Postalcode,
                Country = companyDto.Country,
                Latitude = 1.234,
                Longitude = 5.678
            };

            _companyServiceMock.Setup(service => service.CreateCompanyAsync(It.IsAny<CompanyDto>()))
                .ReturnsAsync(newCompany);

            // Act
            var result = await _controller.CreateCompany(companyDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);  // Controleer op CreatedAtActionResult
            var responseModel = Assert.IsType<ResponseModel<Company>>(createdResult.Value);

            Assert.True(responseModel.Success);
            Assert.NotNull(responseModel.Data);
            Assert.Equal(newCompany.Name, responseModel.Data.Name);
            Assert.Equal(newCompany.Latitude, responseModel.Data.Latitude);
            Assert.Equal(newCompany.Longitude, responseModel.Data.Longitude);
        }


        [Fact]
        public async Task GetCompanies_ReturnsOkResult_WithListOfCompanies_RegressionTest()
        {
            // Arrange
            var companies = new List<Company>
    {
        new Company
        {
            Id = Guid.NewGuid(),
            Name = "Company 1",
            Street = "Street 1",
            HouseNumber = "1",
            City = "City 1",
            Postalcode = 1000,
            Country = "Country 1",
            Latitude = 1.234,
            Longitude = 5.678
        },
        new Company
        {
            Id = Guid.NewGuid(),
            Name = "Company 2",
            Street = "Street 2",
            HouseNumber = "2",
            City = "City 2",
            Postalcode = 2000,
            Country = "Country 2",
            Latitude = 2.345,
            Longitude = 6.789
        }
    };

            // Mock de GetAllCompaniesAsync methode zodat deze de lijst van bedrijven retourneert
            _companyServiceMock.Setup(service => service.GetAllCompaniesAsync())
                .ReturnsAsync(companies);

            // Act
            var result = await _controller.GetCompanies();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);  // Controleer of het resultaat een OkObjectResult is
            var responseModel = Assert.IsType<ResponseModel<List<Company>>>(okResult.Value);  // Controleer het type van de response

            Assert.True(responseModel.Success);
            Assert.NotNull(responseModel.Data);
            Assert.Equal(companies.Count, responseModel.Data.Count);
            Assert.Equal(companies[0].Name, responseModel.Data[0].Name);
            Assert.Equal(companies[1].Name, responseModel.Data[1].Name);
        }

    }
}