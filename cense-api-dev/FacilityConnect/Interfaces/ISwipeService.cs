using FacilityConnect.DTO;

namespace FacilityConnect.Interfaces;

public interface ISwipeService
{
    Task AddSwipeHistoryAsync(string userId, string targetUserId, bool isApproved);
    Task<List<UserWithApprovalDto>> GetApprovalHistoryAsync(string userId);
}
