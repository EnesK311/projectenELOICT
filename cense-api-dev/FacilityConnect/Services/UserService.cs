using FacilityConnect.Data;
using FacilityConnect.DTO;
using FacilityConnect.Enums;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace FacilityConnect.Services;

public class UserService(UserManager<User> userManager, ILocationService locationService, IWebHostEnvironment environment, ApplicationDbContext context, ProfilePictureService profilePictureService) : IUserService
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly ILocationService _locationService = locationService;
    private readonly IWebHostEnvironment _environment = environment;
    private readonly ApplicationDbContext _context = context;
    private readonly ProfilePictureService _profilePictureService = profilePictureService;

    public async Task<UserDto?> GetUserInfoAsync(string authenticatedUserId, string? id = null)
    {
        EnsureAuthenticated(authenticatedUserId);

        string userIdToFetch = id ?? authenticatedUserId;

        var recipient = await _userManager.FindByIdAsync(userIdToFetch);
        if (recipient == null) return null;

        var specialitiesDto = await GetSpecialitiesAsync(recipient.Id);
        var companyDto = await GetCompanyDtoAsync(recipient.CompanyId);
        var projectsDto = await GetProjectsDtoAsync(recipient.Id);


        return MapUserToDto(recipient, specialitiesDto, companyDto, projectsDto);
    }

    public async Task<bool> UpdateUserAsync(string authenticatedUserId, UpdateUserDto userDto)
    {
        EnsureAuthenticated(authenticatedUserId);

        var user = await _userManager.FindByIdAsync(authenticatedUserId);
        if (user == null)
        {
            return false;
        }

        if (!string.IsNullOrEmpty(userDto.SpecialitiesJson))
        {
            try
            {
                userDto.Specialities = JsonConvert.DeserializeObject<SpecialitiesDto>(userDto.SpecialitiesJson);
            }
            catch (JsonException)
            {
                return false;
            }
        }

        if (userDto.ProfilePicture != null)
        {
            string? uploadedImageUrl = await _profilePictureService.UploadImageAsync(userDto.ProfilePicture, user.Id);
            user.ProfilePicture = uploadedImageUrl;
        }

        if (userDto.ProfilePictureLink != null)
        {
            user.ProfilePicture = userDto.ProfilePictureLink;
        }

        if (userDto.Color != null)
        {
            user.Color = userDto.Color;

        }

        user.Email = userDto.Email ?? user.Email;
        user.Firstname = userDto.Firstname ?? user.Firstname;
        user.Lastname = userDto.Lastname ?? user.Lastname;
        user.Bio = userDto.Bio ?? user.Bio;
        user.Age = userDto.Age ?? user.Age;
        user.FunctionTitle = userDto.FunctionTitle ?? user.FunctionTitle;
        user.Experience = userDto.Experience ?? user.Experience;

        if (userDto.Company != null)
        {
            var company = await GetOrCreateCompanyAsync(userDto.Company);
            user.CompanyId = company?.Id;
        }

        if (userDto.Specialities != null)
        {
            await UpdateUserSpecialitiesAsync(user, userDto.Specialities);
        }

        var updateResult = await _userManager.UpdateAsync(user);
        return updateResult.Succeeded;
    }

    public async Task<IEnumerable<UserDto>> FilterUsersAsync(string userId, GetUserDTO filterDto)
    {
        IQueryable<User> query;


        var authenticatedUser = await _context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.Id == userId);


        query = _context.Users
            .Include(u => u.Company)
            .Where(u => u.Id != userId);


        if (!string.IsNullOrEmpty(filterDto.Term))
        {
            query = query.Where(u => u.Firstname.Contains(filterDto.Term) ||
                                     u.Lastname.Contains(filterDto.Term));
        }

        if (filterDto.Distance.HasValue)
        {
            query = ApplyDistanceFilter(query, filterDto.Distance.Value, authenticatedUser.Company.Latitude, authenticatedUser.Company.Longitude);
        }

        if (filterDto.Knowledge != null && filterDto.Knowledge.Any())
        {
            query = query.Include(u => u.UserSpecialities)
                .ThenInclude(us => us.Speciality)
                .Where(u => u.UserSpecialities
                .Any(us => us.RelationType == "known" &&
                filterDto.Knowledge.Contains(us.Speciality!.SpecialityType)));
        }

        if (!string.IsNullOrEmpty(filterDto.FunctionTitle))
        {
            query = query.Where(u => u.FunctionTitle == filterDto.FunctionTitle);
        }

        if (filterDto.IsSwipe)
        {
            var excludedUserIds = await _context.UserChats
                .Where(uc => uc.UserId == userId)
                .SelectMany(uc => uc.Chat!.UserChats!)
                .Where(uc => uc.UserId != userId)
                .Select(uc => uc.UserId)
                .ToListAsync();

            var filteredUsers = await query.Where(u => u.Id != userId && !excludedUserIds.Contains(u.Id)).ToListAsync();

            var randomUsers = await _context.Users
                .Include(u => u.Company)
                .Where(u => u.Id != userId &&
                            !filteredUsers.Select(fu => fu.Id).Contains(u.Id) &&
                            !excludedUserIds.Contains(u.Id))
                .OrderBy(_ => EF.Functions.Random())
                .ToListAsync();

            var filteredUserDtos = new List<UserDto>();
            foreach (var user in filteredUsers)
            {
                filteredUserDtos.Add(await MapToUserDto(user));
            }

            var randomUserDtos = new List<UserDto>();
            foreach (var user in randomUsers)
            {
                randomUserDtos.Add(await MapToUserDto(user));
            }

            return filteredUserDtos.Concat(randomUserDtos);
        }



        var users = await query.ToListAsync();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var userDto = await MapToUserDto(user);
            userDtos.Add(userDto);
        }

        return userDtos;

    }




    private IQueryable<User> ApplyDistanceFilter(IQueryable<User> query, double maxDistance, double? userLatitude, double? userLongitude)
    {
        if (userLatitude == null || userLongitude == null) throw new Exception("Cannot access user latitude and longitude.");
        
        const double EarthRadiusKm = 6371.0;
        double lat = userLatitude.Value;
        double lon = userLongitude.Value;

        return query.Where(u =>
            u.Company.Latitude.HasValue &&
            u.Company.Longitude.HasValue &&
            EarthRadiusKm * 2 * Math.Asin(Math.Sqrt(
                Math.Pow(Math.Sin((u.Company.Latitude.Value - lat) * Math.PI / 180.0 / 2), 2) +
                Math.Cos(lat * Math.PI / 180.0) *
                Math.Cos(u.Company.Latitude.Value * Math.PI / 180.0) *
                Math.Pow(Math.Sin((u.Company.Longitude.Value - lon) * Math.PI / 180.0 / 2), 2)
            )) <= maxDistance
        );
    }



    private async Task<UserDto> MapToUserDto(User user)
    {
        var specialitiesDto = await GetSpecialitiesAsync(user.Id);
        var companyDto = user.Company != null ? await GetCompanyDtoAsync(user.Company.Id) : null;
        var projectsDto = await GetProjectsDtoAsync(user.Id);

        return MapUserToDto(user, specialitiesDto, companyDto,projectsDto);
    }

    private static void EnsureAuthenticated(string authenticatedUserId)
    {
        if (string.IsNullOrEmpty(authenticatedUserId))
            throw new UnauthorizedAccessException("Unauthorized");
    }

    private async Task<SpecialitiesDto> GetSpecialitiesAsync(string userId)
    {
        var userSpecialities = await _context.UserSpecialities
            .Where(us => us.UserId == userId)
            .Include(us => us.Speciality)
            .ToListAsync();

        return new SpecialitiesDto
        {
            Known = MapSpecialities(userSpecialities, "known"),
            Needed = MapSpecialities(userSpecialities, "needed")
        };
    }

    private static List<SpecialityInput> MapSpecialities(IEnumerable<UserSpeciality> userSpecialities, string relationType)
    {
        return userSpecialities
            .Where(us => us.RelationType == relationType)
            .Select(us => new SpecialityInput
            {
                Name = us.Speciality.SpecialityType,
                Category = us.Speciality.Category
            })
            .ToList();
    }

    private async Task<CompanyDto?> GetCompanyDtoAsync(Guid? companyId)
    {
        if (!companyId.HasValue) return null;

        var company = await _context.Companies.FindAsync(companyId.Value);
        if (company == null) return null;

        return new CompanyDto
        {
            Name = company.Name,
            Street = company.Street,
            HouseNumber = company.HouseNumber,
            City = company.City,
            Postalcode = company.Postalcode,
            Country = company.Country,
            Longitude = company.Longitude,
            Latitude = company.Latitude
        };
    }
    private async Task<List<ProjectDto>> GetProjectsDtoAsync(string userId)
    {
        var projects = await _context.Projects
            .Where(project => project.UserId == userId)
            .ToListAsync();

        if (!projects.Any()) return new List<ProjectDto>();

        // Map elk project naar een ProjectDto
        return projects.Select(project => new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Year = (int)project.Year,
            Month = (int)project.Month
        }).ToList();
    }


    private static UserDto MapUserToDto(User user, SpecialitiesDto specialitiesDto, CompanyDto? companyDto, List<ProjectDto> projectsDto)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            Bio = user.Bio,
            Age = user.Age,
            ProfilePicture = user.ProfilePicture,
            Color = user.Color,
            FunctionTitle = user.FunctionTitle,
            Experience = user.Experience,
            Specialities = specialitiesDto,
            Company = companyDto,
            Projects = projectsDto
        };
    }

    private async Task<Company?> GetOrCreateCompanyAsync(CompanyDto companyDto)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name == companyDto.Name && c.City == companyDto.City);

        if (company == null)
        {
            company = new Company
            {
                Name = companyDto.Name,
                Street = companyDto.Street,
                HouseNumber = companyDto.HouseNumber,
                City = companyDto.City,
                Postalcode = companyDto.Postalcode,
                Country = companyDto.Country,
                Longitude = companyDto.Longitude,
                Latitude = companyDto.Latitude
            };

            var coords = await _locationService.ConvertAddressToCoordinatesAsync(companyDto.Street, companyDto.HouseNumber, companyDto.City, companyDto.Postalcode, "Belgium");
            if (coords.HasValue)
            {
                company.Longitude = coords.Value.Longitude;
                company.Latitude = coords.Value.Latitude;
            }


            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
        }

        return company;
    }

    private async Task UpdateUserSpecialitiesAsync(User user, SpecialitiesDto specialitiesDto)
    {
        var existingUserSpecialities = _context.UserSpecialities.Where(us => us.UserId == user.Id);
        _context.UserSpecialities.RemoveRange(existingUserSpecialities);

        var allSpecialities = new List<(string Name, Category Category, string RelationType)>();

        if (specialitiesDto.Known != null)
        {
            allSpecialities.AddRange(specialitiesDto.Known.Select(s => (s.Name, (Category)s.Category, "known")));
        }
        if (specialitiesDto.Needed != null)
        {
            allSpecialities.AddRange(specialitiesDto.Needed.Select(s => (s.Name, (Category)s.Category, "needed")));
        }

        var specialityNames = allSpecialities.Select(s => s.Name).Distinct().ToList();
        var specialities = await _context.Specialities
            .Where(s => specialityNames.Contains(s.SpecialityType))
            .ToListAsync();

        var newSpecialities = allSpecialities
            .Where(s => !specialities.Any(sp => sp.SpecialityType == s.Name && sp.Category == s.Category))
            .Select(s => new Speciality
            {
                SpecialityType = s.Name,
                Category = s.Category
            }).ToList();

        if (newSpecialities.Count != 0)
        {
            _context.Specialities.AddRange(newSpecialities);
            await _context.SaveChangesAsync();

            specialities.AddRange(newSpecialities);
        }

        var userSpecialities = allSpecialities
            .Select(s =>
            {
                var speciality = specialities.FirstOrDefault(sp => sp.SpecialityType == s.Name && sp.Category == s.Category);
                if (speciality == null) return null;
                return new UserSpeciality
                {
                    UserId = user.Id,
                    SpecialityId = speciality.Id,
                    RelationType = s.RelationType
                };
            })
            .Where(us => us != null)
            .Cast<UserSpeciality>()
            .GroupBy(us => new { us.SpecialityId, us.RelationType })
            .Select(g => g.First())
            .ToList();

        _context.UserSpecialities.AddRange(userSpecialities);
        await _context.SaveChangesAsync();
    }
}

