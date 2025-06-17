using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FacilityConnect.Interfaces;

namespace FacilityConnect.Services;

public class ProfilePictureService : IProfilePictureService
{
    private readonly Cloudinary _cloudinary;

    public ProfilePictureService()
    {
        _cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
        _cloudinary.Api.Secure = true;
    }

    public async Task<string> UploadImageAsync(IFormFile file, string userId)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is invalid");

        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = $"users/{userId}",
            Overwrite = true,
            Transformation = new Transformation()
                .Width(1024) 
                .Height(1024) 
                .Crop("limit")
                .Quality("auto")
                .FetchFormat("auto")

        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }
}
