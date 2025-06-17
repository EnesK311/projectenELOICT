using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacilityConnect.Controllers;

[ApiController]
[Route("api/v1/swipe")]
[Authorize]
public class SwipeController(ISwipeService swipeService) : BaseController
{
    private readonly ISwipeService _swipeService = swipeService;

    [HttpPost("add")]
    public async Task<IActionResult> AddApproval([FromBody] SwipeRequestDto request)
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        await _swipeService.AddSwipeHistoryAsync(userId, request.TargetUserId, request.IsApproved);
        return Ok(new ResponseModel<string> { Success = true, Data = "Successfully added user to history" });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetApprovalHistory()
    {
        if (ValidateAndGetUserId<string>(out string? userId) is IActionResult validationResult) return validationResult;

        var history = await _swipeService.GetApprovalHistoryAsync(userId);
        return Ok(new ResponseModel<List<UserWithApprovalDto>> { Success= true, Data = history});
    }
}
