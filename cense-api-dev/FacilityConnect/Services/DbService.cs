using FacilityConnect.Data;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FacilityConnect.Services;

public class DbService(ApplicationDbContext context) : IDbService
{
    private readonly ApplicationDbContext _context = context;

    // Algemene methodes (CRUD)

    public async Task<IEnumerable<T>> GetAllEntitiesAsync<T>() where T : class
    {
        return await _context.Set<T>().ToListAsync();
    }

    public async Task<T?> GetEntityAsync<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        return await _context.Set<T>().FirstOrDefaultAsync(predicate);
    }

    public async Task<bool> EntityExistsAsync<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        return await _context.Set<T>().AnyAsync(predicate);
    }

    public async Task AddEntityAsync<T>(T entity) where T : class
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public Task UpdateEntityAsync<T>(T entity) where T : class
    {
        _context.Set<T>().Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteEntityAsync<T>(T entity) where T : class
    {
        _context.Set<T>().Remove(entity);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    // Specifieke methodes (Gebruiker & Chat)

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email)
            ?? throw new UnauthorizedAccessException("Unauthorized");
    }

    public async Task ValidateUserInChatAsync(string? userId, string chatId)
    {
        bool isUserInChat = await _context.UserChats.AnyAsync(uc => uc.ChatId.ToString() == chatId && uc.UserId == userId);
        if (!isUserInChat)
            throw new UnauthorizedAccessException("Unauthorized");
    }

    public async Task<List<Guid>> GetUserChatsAsync(string userId)
    {
        return await _context.UserChats
            .Where(uc => uc.UserId == userId)
            .Select(uc => uc.ChatId)
            .ToListAsync();
    }

    public async Task<bool> ChatAlreadyExistsAsync(string userId, string recipientId)
    {
        return await _context.UserChats
            .Where(uc => uc.UserId == userId || uc.UserId == recipientId)
            .GroupBy(uc => uc.ChatId)
            .AnyAsync(g => g.Count() == 2 && g.Any(uc => uc.UserId == userId) && g.Any(uc => uc.UserId == recipientId));
    }
}
