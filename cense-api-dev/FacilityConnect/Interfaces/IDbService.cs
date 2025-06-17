using FacilityConnect.Model;
using System.Linq.Expressions;

namespace FacilityConnect.Interfaces;

public interface IDbService
{
    // Algemeen
    Task<IEnumerable<T>> GetAllEntitiesAsync<T>() where T : class;
    Task<T?> GetEntityAsync<T>(Expression<Func<T, bool>> predicate) where T : class;
    Task<bool> EntityExistsAsync<T>(Expression<Func<T, bool>> predicate) where T : class;
    Task AddEntityAsync<T>(T entity) where T : class;
    Task UpdateEntityAsync<T>(T entity) where T : class;
    Task DeleteEntityAsync<T>(T entity) where T : class;
    Task SaveChangesAsync();

    // Gebruiker-specifiek
    Task<User?> GetUserByEmailAsync(string email);
    Task<List<Guid>> GetUserChatsAsync(string userId);

    // Chat-specifiek
    Task ValidateUserInChatAsync(string? userId, string chatId);
    Task<bool> ChatAlreadyExistsAsync(string userId, string recipientId);
}