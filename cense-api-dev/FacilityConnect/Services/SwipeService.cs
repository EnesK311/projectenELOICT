using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.EntityFrameworkCore;

namespace FacilityConnect.Services;

public class SwipeService(ApplicationDbContext context) : ISwipeService
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddSwipeHistoryAsync(string userId, string targetUserId, bool isApproved)
    {
        var history = CreateSwipeHistory(userId, targetUserId, isApproved);

        _context.SwipeHistory.Add(history);
        await _context.SaveChangesAsync();
    }

    public async Task<List<UserWithApprovalDto>> GetApprovalHistoryAsync(string userId)
    {
        var swipeHistory = await FetchSwipeHistoryAsync(userId);
        var userDtos = MapToUserDtoList(swipeHistory);

        return userDtos;
    }

    private static SwipeHistory CreateSwipeHistory(string userId, string targetUserId, bool isApproved)
    {
        return new SwipeHistory
        {
            UserId = userId,
            TargetUserId = targetUserId,
            IsApproved = isApproved,
            ActionDate = DateTime.UtcNow
        };
    }

    private async Task<List<SwipeHistory>> FetchSwipeHistoryAsync(string userId)
    {
        return await _context.SwipeHistory
            .Where(h => h.UserId == userId)
            .Include(h => h.TargetUser) 
            .ToListAsync();
    }

    private static List<UserWithApprovalDto> MapToUserDtoList(IEnumerable<SwipeHistory> swipeHistory)
    {
        return swipeHistory
            .Where(h => h.TargetUser != null)
            .Select(h => new UserWithApprovalDto
            {
                User = MapToUserDto(h.TargetUser!),
                IsApproved = h.IsApproved
            })
            .ToList();
    }

    private static UserDto MapToUserDto(User targetUser)
    {
        return new UserDto
        {
            Id = targetUser.Id,
            Email = targetUser.Email,
            Firstname = targetUser.Firstname,
            Lastname = targetUser.Lastname,
            Bio = targetUser.Bio,
            Age = targetUser.Age,
            ProfilePicture = targetUser.ProfilePicture,
            Color = targetUser.Color,
            FunctionTitle = targetUser.FunctionTitle,
            Company = MapToCompanyDto(targetUser.Company),
            Specialities = (targetUser.UserSpecialities != null && targetUser.UserSpecialities.Count != 0) ?
            MapToSpecialitiesDto(targetUser.UserSpecialities) :
            new SpecialitiesDto
            {
                Known = [],
                Needed = []
            }
        };
    }

    private static CompanyDto? MapToCompanyDto(Company? company)
    {
        return company == null
            ? null
            : new CompanyDto
            {
                Name = company.Name,
                Street = company.Street,
                HouseNumber = company.HouseNumber,
                Postalcode = company.Postalcode,
                City = company.City,
                Country = company.Country
            };
    }

    private static SpecialitiesDto MapToSpecialitiesDto(ICollection<UserSpeciality> specialities)
    {
        return new SpecialitiesDto
        {
            Known =  MapSpecialities(specialities, "known"),
            Needed = MapSpecialities(specialities, "needed")
        };
    }

    private static List<SpecialityInput> MapSpecialities(IEnumerable<UserSpeciality> userSpecialities, string relationType)
    {
        if (userSpecialities == null) return [];

        return userSpecialities
           .Where(us => us.RelationType == relationType)
           .Select(us => new SpecialityInput
           {
               Name = us.Speciality!.SpecialityType,
               Category = us.Speciality.Category
           })
           .ToList();
    }
}
