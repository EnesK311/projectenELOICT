using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacilityConnect.Controllers;

[ApiController]
[Route("api/v1/chats")]
[Authorize]
public class ChatController(IChatService chatService) : BaseController
{
    private readonly IChatService _chatService = chatService;

    [HttpGet("{chatId}/messages")]
    public async Task<IActionResult> GetChatHistory(string chatId)
    {
        if (ValidateAndGetUserEmail<List<MessageDto>>(out string? userEmail) is IActionResult validationResult) return validationResult;

        try
        {
            var messages = await _chatService.GetChatHistoryAsync(chatId, userEmail);
            return Ok(new ResponseModel<List<MessageDto>> { Success = true, Data = messages });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ResponseModel<List<MessageDto>> { Success = false, Error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUserChats()
    {
        if (ValidateAndGetUserEmail<List<ChatWithUsersDto>>(out string? userEmail) is IActionResult validationResult) return validationResult;

        var chats = await _chatService.GetAllUserChatsAsync(userEmail);
        return Ok(new ResponseModel<List<ChatWithUsersDto>> { Success = true, Data = chats });
    }

    [HttpPost]
    public async Task<IActionResult> CreateChat([FromBody] CreateChatDto createChatDto)
    {
        if (ValidateAndGetUserEmail<ChatWithUsersDto>(out string? userEmail) is IActionResult validationResult) return validationResult;

        try
        {
            var chat = await _chatService.CreateChatAsync(userEmail, createChatDto);
            return Ok(new ResponseModel<ChatWithUsersDto> { Success = true, Data = chat });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ResponseModel<ChatWithUsersDto> { Success = false, Error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ResponseModel<ChatWithUsersDto> { Success = false, Error = ex.Message });
        }
    }

    [HttpGet("available-users")]
    public async Task<IActionResult> GetAllAvailableUsers()
    {
        if (ValidateAndGetUserId<List<UserDto>>(out string? userId) is IActionResult validationResult) return validationResult;

        var users = await _chatService.GetAvailableUsersAsync(userId);
        return Ok(new ResponseModel<List<UserDto>> { Success = true, Data = users });
    }


    [HttpGet("unread-messages")]
    public async Task<IActionResult> GetUnreadMessages()
    {
        if (ValidateAndGetUserEmail<List<UnreadMessageDto>>(out string? userEmail) is IActionResult validationResult)
            return validationResult;

        try
        {
            var unreadMessages = await _chatService.GetUnreadMessagesAsync(userEmail);
            return Ok(new ResponseModel<List<UnreadMessageDto>> { Success = true, Data = unreadMessages });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ResponseModel<List<UnreadMessageDto>> { Success = false, Error = ex.Message });
        }
    }

}
