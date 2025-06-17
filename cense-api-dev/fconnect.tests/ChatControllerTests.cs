using FacilityConnect.Controllers;
using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace fconnect.tests;

public class ChatControllerTests
{
    private readonly Mock<IChatService> _mockChatService;
    private readonly ChatController _controller;

    public ChatControllerTests()
    {
        _mockChatService = new Mock<IChatService>();

        _controller = new ChatController(_mockChatService.Object);

        // Mock user identity setup
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, "test@example.com"),
            new Claim(ClaimTypes.NameIdentifier, "1"),
        }, "mock"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    [Fact]
    public async Task GetChatHistory_ReturnsUnauthorized_WhenUserNotFound()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        // Act
        var result = await _controller.GetChatHistory("1");

        // Assert
        var actionResult = Assert.IsType<UnauthorizedObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<List<MessageDto>>>(actionResult.Value);
        Assert.False(responseModel.Success);
        Assert.Equal("Unauthorized", responseModel.Error);
    }

    [Fact]
    public async Task GetChatHistory_ReturnsMessages_WhenChatExistsAndUserIsInChat()
    {
        // Arrange
        var chatId = "1";
        var messages = new List<MessageDto>
        {
            new MessageDto { UserId = "1", RecipientId= "2", Content = "Hello", IsRead = true, TimeStamp = DateTime.UtcNow },
            new MessageDto { UserId = "2", RecipientId= "1", Content = "Hi", IsRead = true, TimeStamp = DateTime.UtcNow.AddMinutes(1) }
        };

        _mockChatService.Setup(s => s.GetChatHistoryAsync(chatId, "test@example.com"))
                        .ReturnsAsync(messages);

        // Act
        var result = await _controller.GetChatHistory(chatId);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<List<MessageDto>>>(actionResult.Value);
        Assert.True(responseModel.Success);
        Assert.Equal(messages, responseModel.Data);

    }
    [Fact]
    public async Task GetAllUserChats_ReturnsChats_WhenUserHasChats()
    {
        // Arrange
        var users = new List<UserDto>
    {
        new UserDto { Id = "1", Email = "test@example.com" }
    };

        // Map de UserDto naar ChatUserDetailsDto
        var chatUserDetails = users.Select(user => new ChatUserDetailsDto
        {
            UserId = user.Id,
            Firstname = "DefaultFirstname",
            Lastname = "DefaultLastname",
            ProfilePicture = "default.jpg",
            Color = "#0000ff"
        }).ToList();

        var chats = new List<ChatWithUsersDto>
    {
        new ChatWithUsersDto
        {
            ChatId = "1",
            Users = chatUserDetails
        }
    };

        _mockChatService.Setup(s => s.GetAllUserChatsAsync("test@example.com"))
                        .ReturnsAsync(chats);

        // Act
        var result = await _controller.GetAllUserChats();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<List<ChatWithUsersDto>>>(actionResult.Value);

        Assert.True(responseModel.Success);
        Assert.Equal(chats, responseModel.Data);
    }
    [Fact]
    public async Task CreateChat_CreatesNewChat_WhenValidRequest()
    {
        // Arrange
        var createChatDto = new CreateChatDto { RecipientId = "2" };

        var users = new List<UserDto>
    {
        new UserDto { Id = "1", Email = "test@example.com", Firstname = "John", Lastname = "Doe", ProfilePicture = "profile.jpg" }
    };

        var createdChat = new ChatWithUsersDto
        {
            ChatId = "1",
            // Zet de users lijst om naar ChatUserDetailsDto
            Users = users.Select(user => new ChatUserDetailsDto
            {
                UserId = user.Id,
                Firstname = user.Firstname ?? "Default Firstname",
                Lastname = user.Lastname ?? "Default Lastname",
                ProfilePicture = user.ProfilePicture ?? "default-profile.jpg",
                Color = "#0000ff"
            }).ToList()
        };

        _mockChatService.Setup(s => s.CreateChatAsync("test@example.com", createChatDto))
                        .ReturnsAsync(createdChat);

        // Act
        var result = await _controller.CreateChat(createChatDto);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<ChatWithUsersDto>>(actionResult.Value);

        Assert.True(responseModel.Success);
        Assert.Equal(createdChat, responseModel.Data);
    }

    [Fact]
    public async Task GetAllAvailableUsers_ReturnsUsers_WhenValidRequest()
    {
        // Arrange
        var users = new List<UserDto>
        {
            new UserDto { Id = "2", Email = "user2@example.com" }
        };

        _mockChatService.Setup(s => s.GetAvailableUsersAsync("1"))
                        .ReturnsAsync(users);

        // Act
        var result = await _controller.GetAllAvailableUsers();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<List<UserDto>>>(actionResult.Value);
        Assert.True(responseModel.Success);
        Assert.Equal(users, responseModel.Data);
    }

    // regression test


    // Controleert of een lege lijst geen problemen veroorzaakt en correct wordt weergegeven
    [Fact]
    public async Task GetChatHistory_ReturnsEmptyList_WhenNoMessagesExist()
    {
        // Arrange
        var chatId = "1";
        var emptyMessages = new List<MessageDto>();

        _mockChatService.Setup(s => s.GetChatHistoryAsync(chatId, "test@example.com"))
                        .ReturnsAsync(emptyMessages);

        // Act
        var result = await _controller.GetChatHistory(chatId);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var responseModel = Assert.IsType<ResponseModel<List<MessageDto>>>(actionResult.Value);

        Assert.True(responseModel.Success);
        Assert.NotNull(responseModel.Data);
        Assert.Empty(responseModel.Data);
    }

}
