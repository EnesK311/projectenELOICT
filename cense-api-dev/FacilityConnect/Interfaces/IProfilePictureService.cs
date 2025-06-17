namespace FacilityConnect.Interfaces
{
    public interface IProfilePictureService
    {
        Task<string> UploadImageAsync(IFormFile file, string userId);
    }
}
