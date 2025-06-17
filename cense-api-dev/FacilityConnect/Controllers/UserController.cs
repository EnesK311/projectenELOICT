using FacilityConnect.Model;
using FacilityConnect.DTO;
using Microsoft.AspNetCore.Mvc;
using FacilityConnect.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace FacilityConnect.Controllers;

[ApiController]
[Route("/api/v1/users")]
[Authorize]
public class UserController(IUserService userService) : BaseController
{
    private readonly IUserService _userService = userService;

    [HttpGet("id")]
    public Task<IActionResult> GetUserById()
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return Task.FromResult(validationResult);

        return Task.FromResult<IActionResult>(Ok(new ResponseModel<string>
        {
            Success = true,
            Data = userId
        }));
    }

    [HttpPut("info")]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDto userDto)
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        bool result = await _userService.UpdateUserAsync(userId, userDto);
        return result ? Ok(new ResponseModel<string>
        {
            Success = true,
            Data = "User updated successfully"
        }) : BadRequest(new ResponseModel<string>
        {
            Success = false,
            Data = "Failed to update user"
        });
    }

    [HttpGet("info")]
    public async Task<IActionResult> GetUserInfo()
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        var userDto = await _userService.GetUserInfoAsync(userId);
        return Ok(new ResponseModel<UserDto>
        {
            Success = true,
            Data = userDto
        });
    }

    [HttpGet("info/{id}")]
    public async Task<IActionResult> GetUserInfoById(string id)
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        var userDto = await _userService.GetUserInfoAsync(userId, id);
        if (userDto == null)
        {
            return NotFound(new ResponseModel<string>
            {
                Success = false,
                Data = "User not found"
            });
        }

        return Ok(new ResponseModel<UserDto>
        {
            Success = true,
            Data = userDto
        });
    }

    [HttpGet()]
    public async Task<IActionResult> FilterUsers([FromQuery] GetUserDTO filterDto)
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        var users = await _userService.FilterUsersAsync(userId, filterDto);

        return Ok(new ResponseModel<IEnumerable<UserDto>>
        {
            Success = true,
            Data = users
        });
    }
}
