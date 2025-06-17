using FacilityConnect.DTO;

namespace FacilityConnect.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetUserInfoAsync(string authenticatedUserId, string? id = null);
    Task<bool> UpdateUserAsync(string authenticatedUserId, UpdateUserDto userDto);
    Task<IEnumerable<UserDto>> FilterUsersAsync(string authenticatedUserId, GetUserDTO filterDto);
}
