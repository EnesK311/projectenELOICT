using FacilityConnect.Controllers;
using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace fconnect.tests;
public class SwipeControllerTests
{
    private readonly Mock<ISwipeService> _swipeServiceMock;
    private readonly SwipeController _controller;

    public SwipeControllerTests()
    {
        _swipeServiceMock = new Mock<ISwipeService>();
        _controller = new SwipeController(_swipeServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task AddApproval_ValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = "123"; // Mock user ID
        var swipeRequest = new SwipeRequestDto
        {
            TargetUserId = "456",
            IsApproved = true
        };

        // Stel een mock gebruiker in via claims
        var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };

        _swipeServiceMock
            .Setup(x => x.AddSwipeHistoryAsync(userId, swipeRequest.TargetUserId, swipeRequest.IsApproved))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.AddApproval(swipeRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal("Successfully added user to history", response.Data);

        _swipeServiceMock.Verify(
            x => x.AddSwipeHistoryAsync(userId, swipeRequest.TargetUserId, swipeRequest.IsApproved),
            Times.Once);
    }

    [Fact]
    public async Task AddApproval_InvalidUserId_ReturnsUnauthorized()
    {
        // Arrange
        var swipeRequest = new SwipeRequestDto
        {
            TargetUserId = "456",
            IsApproved = true
        };

        // No UserId set in HttpContext
        _controller.HttpContext.Items["UserId"] = null;

        // Act
        var result = await _controller.AddApproval(swipeRequest);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(unauthorizedResult.Value);
        Assert.False(response.Success);
        Assert.Null(response.Data);

        _swipeServiceMock.Verify(
            x => x.AddSwipeHistoryAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()),
            Times.Never);
    }


    [Fact]
    public async Task GetApprovalHistory_InvalidUserId_ReturnsUnauthorized()
    {
        // Arrange
        _controller.HttpContext.Items["UserId"] = null; // No UserId in context

        // Act
        var result = await _controller.GetApprovalHistory();

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var response = Assert.IsType<ResponseModel<string>>(unauthorizedResult.Value);
        Assert.False(response.Success);
        Assert.Null(response.Data);

        _swipeServiceMock.Verify(x => x.GetApprovalHistoryAsync(It.IsAny<string>()), Times.Never);
    }
}
