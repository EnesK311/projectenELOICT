using FacilityConnect.Controllers;
using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Enums;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using FacilityConnect.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace fconnect.tests;

public class UserControllerTests
{
    private readonly Mock<IUserService> _mockUserService;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _mockUserService = new Mock<IUserService>();
        _controller = new UserController(_mockUserService.Object);
    }

    private void SetUserContext(string userId)
    {
        var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        }));
        _controller.ControllerContext.HttpContext = new DefaultHttpContext { User = userClaims };
    }
    [Fact]
    public async Task GetUserId_ReturnsUserId_WhenAuthenticated()
    {
        // Arrange
        SetUserContext("test-id");

        // Act
        var result = await _controller.GetUserById();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal("test-id", response.Data);
    }

    [Fact]
    public async Task GetUserId_ReturnsUnauthorized_WhenNotAuthenticated()
    {
        // Arrange
        _controller.ControllerContext.HttpContext = new DefaultHttpContext();

        // Act
        var result = await _controller.GetUserById();

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(unauthorizedResult.Value);
        Assert.False(response.Success);
        Assert.Null(response.Data);
    }
    [Fact]
    public async Task UpdateUser_UpdatesUser_WhenValid()
    {
        // Arrange
        SetUserContext("test-id");

        var updateDto = new UpdateUserDto { Email = "new@example.com" };
        _mockUserService.Setup(x => x.UpdateUserAsync("test-id", updateDto))
                        .ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateUser(updateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal("User updated successfully", response.Data);
    }

    [Fact]
    public async Task UpdateUser_ReturnsUnauthorized_WhenNotAuthenticated()
    {
        // Arrange
        var updateDto = new UpdateUserDto();

        // Mock HttpContext en stel in dat de gebruiker niet geauthenticeerd is
        var httpContext = new DefaultHttpContext();
        httpContext.User = new ClaimsPrincipal();
        _controller.ControllerContext.HttpContext = httpContext;

        // Act
        var result = await _controller.UpdateUser(updateDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(unauthorizedResult.Value);
        Assert.False(response.Success);
        Assert.Null(response.Data);
    }

    [Fact]
    public async Task GetUserInfo_ReturnsUserInfo_WhenAuthenticated()
    {
        // Arrange
        SetUserContext("test-id");
        var userDto = new UserDto
        {
            Id = "test-id",
            Firstname = "John",
            Lastname = "Doe"
        };

        // Mock the service method
        _mockUserService.Setup(x => x.GetUserInfoAsync("test-id", null))
                        .ReturnsAsync(userDto);

        // Act
        var result = await _controller.GetUserInfo();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ResponseModel<UserDto>>(okResult.Value);
        Assert.True(response.Success);
        Assert.NotNull(response.Data);
        Assert.Equal("John", response.Data.Firstname);
        Assert.Equal("Doe", response.Data.Lastname);

        // Verify that the mock was called as expected
        _mockUserService.Verify(x => x.GetUserInfoAsync("test-id", null), Times.Once);
    }


    [Fact]
    public async Task GetUserInfo_ReturnsUnauthorized_WhenNotAuthenticated()
    {
        // Arrange
        _controller.ControllerContext.HttpContext = new DefaultHttpContext();

        // Act
        var result = await _controller.GetUserInfo();

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(unauthorizedResult.Value);
        Assert.False(response.Success);
        Assert.Null(response.Data);
    }
    [Fact]
    public async Task FilterUsers_ReturnsFilteredUsers()
    {
        // Arrange
        SetUserContext("test-id");
        var users = new List<UserDto>
    {
        new UserDto { Id = "1", Firstname = "Alice" },
        new UserDto { Id = "2", Firstname = "Bob" }
    };
        _mockUserService.Setup(x => x.FilterUsersAsync("test-id", It.IsAny<GetUserDTO>()))
                        .ReturnsAsync(users);

        // Act
        var result = await _controller.FilterUsers(new GetUserDTO());

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ResponseModel<IEnumerable<UserDto>>>(okResult.Value);
        Assert.True(response.Success);
        Assert.NotNull(response.Data);
        Assert.Equal(2, response.Data.Count());
        Assert.Contains(response.Data, u => u.Firstname == "Alice");
        Assert.Contains(response.Data, u => u.Firstname == "Bob");
    }
    [Fact]
    public async Task UpdateUserAsync_ShouldUpdateSpecialities_WhenKnownAndNeededSpecialitiesAreProvided()
    {
        // Arrange
        var authenticatedUserId = "test-user-id";

        var userDto = new UpdateUserDto
        {
            Email = "test@example.com",
            Firstname = "John",
            Lastname = "Doe",
            Bio = "Some bio",
            Age = 30,
            FunctionTitle = "Developer",
            Specialities = new SpecialitiesDto
            {
                Known = new List<SpecialityInput>
                {
                    new SpecialityInput { Name = "Laadpalen", Category = Category.Energie }
                },
                Needed = new List<SpecialityInput>
                {
                    new SpecialityInput { Name = "Zonnepanelen", Category = Category.Energie }
                }
            }
        };

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        // Gebruik een nieuwe instance van de In-Memory DbContext
        using var context = new ApplicationDbContext(options);

        // Voeg testdata toe aan de In-Memory Database
        var user = new User
        {
            Id = authenticatedUserId,
            Email = "old@example.com",
            Firstname = "OldFirst",
            Lastname = "OldLast",
            Bio = "Old bio",
            Age = 25,
            FunctionTitle = "Old Function"
        };

        context.Users.Add(user);
        context.Specialities.AddRange(
            new Speciality { Id = Guid.NewGuid(), SpecialityType = "Laadpalen", Category = Category.Energie },
            new Speciality { Id = Guid.NewGuid(), SpecialityType = "Zonnepanelen", Category = Category.Energie }
        );
        await context.SaveChangesAsync();

        var mockUserManager = new Mock<UserManager<User>>(
            Mock.Of<IUserStore<User>>(), null, null, null, null, null, null, null, null);

        mockUserManager.Setup(x => x.FindByIdAsync(authenticatedUserId)).ReturnsAsync(user);
        mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Success);

        var userService = new UserService(mockUserManager.Object, null, null, context, null);

        // Act
        var result = await userService.UpdateUserAsync(authenticatedUserId, userDto);

        // Assert
        Assert.True(result);

        // Controleer of de specialiteiten zijn toegevoegd
        var userSpecialities = await context.UserSpecialities
            .Include(us => us.Speciality)
            .Where(us => us.UserId == authenticatedUserId)
            .ToListAsync();

        Assert.Contains(userSpecialities, us => us.Speciality.SpecialityType == "Laadpalen" && us.RelationType == "known");
        Assert.Contains(userSpecialities, us => us.Speciality.SpecialityType == "Zonnepanelen" && us.RelationType == "needed");
    }


}