using FacilityConnect.Model;
using Microsoft.AspNetCore.Mvc;

namespace FacilityConnect.Controllers;

public abstract class BaseController : ControllerBase
{
    protected string? GetUserEmail()
    {
        return User.Identity?.Name;
    }

    protected string? GetUserId()
    {
        return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    }

    protected IActionResult ValidateAndGetUserEmail<T>(out string userEmail)
    {
        userEmail = GetUserEmail()!;
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized(new ResponseModel<T>
            {
                Success = false,
                Error = "Unauthorized"
            });
        }
        return null!;
    }

    protected IActionResult ValidateAndGetUserId<T>(out string userId)
    {
        userId = GetUserId()!;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new ResponseModel<T>
            {
                Success = false,
                Error = "Unauthorized"
            });
        }
        return null!;
    }
}
