using FacilityConnect.Enums;
using FacilityConnect.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FacilityConnect.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Company> Companies { get; set; }
    public DbSet<Speciality> Specialities { get; set; }
    public DbSet<UserSpeciality> UserSpecialities { get; set; }
    public DbSet<Chat> Chats { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<UserChat> UserChats { get; set; }
    public DbSet<SwipeHistory> SwipeHistory { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("FacilityConnect");

        builder.Entity<User>()
            .HasOne(u => u.Company)
            .WithMany(c => c.Users)
            .HasForeignKey(u => u.CompanyId);

        builder.Entity<User>()
           .HasMany(u => u.Projects)
           .WithOne(p => p.User)
           .HasForeignKey(p => p.UserId)
           .OnDelete(DeleteBehavior.Cascade);

        // Define many-to-many relationship for UserSpeciality
        builder.Entity<UserSpeciality>()
            .HasKey(us => new { us.UserId, us.SpecialityId, us.RelationType });

        builder.Entity<UserSpeciality>()
            .HasOne(us => us.User)
            .WithMany(u => u.UserSpecialities)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserSpeciality>()
            .HasOne(us => us.Speciality)
            .WithMany(s => s.UserSpecialities)
            .HasForeignKey(us => us.SpecialityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Chat>()
            .HasMany(c => c.UserChats)  
            .WithOne(uc => uc.Chat)     
            .HasForeignKey(uc => uc.ChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Chat>()
            .HasMany(c => c.Messages)
            .WithOne(m => m.Chat)
            .HasForeignKey(m => m.ChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>()
            .HasOne(m => m.Chat)  
            .WithMany(c => c.Messages)  
            .HasForeignKey(m => m.ChatId)  
            .OnDelete(DeleteBehavior.Cascade);  

        // Define many-to-many relationship for UserChat
        builder.Entity<UserChat>()
            .HasKey(uc => new { uc.UserId, uc.ChatId });

        builder.Entity<UserChat>()
            .HasOne(uc => uc.User)
            .WithMany(u => u.UserChats)
            .HasForeignKey(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Entity<UserChat>()
            .HasOne(uc => uc.Chat)
            .WithMany(c => c.UserChats)
            .HasForeignKey(uc => uc.ChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<SwipeHistory>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<SwipeHistory>()
            .HasOne(u => u.TargetUser)
            .WithMany()
            .HasForeignKey(u => u.TargetUserId)
            .OnDelete(DeleteBehavior.Restrict);

       

        builder.Entity<Speciality>().HasData(
        new Speciality { Category = Category.Energie, SpecialityType = "Laadpalen" },
        new Speciality { Category = Category.Energie, SpecialityType = "Zonnepanelen" },
        new Speciality { Category = Category.Energie, SpecialityType = "Verlichting" },
        new Speciality { Category = Category.Energie, SpecialityType = "HVAC" },
        new Speciality { Category = Category.Energie, SpecialityType = "Vernieuwing stookplaatsen" },
        new Speciality { Category = Category.Juridisch, SpecialityType = "Wettelijke verplichtingen laadpalen" },
        new Speciality { Category = Category.Juridisch, SpecialityType = "Wettelijke verplichtingen PV-panelen" },
        new Speciality { Category = Category.Juridisch, SpecialityType = "EPC-NR" },
        new Speciality { Category = Category.Juridisch, SpecialityType = "Fietsleasing" },
        new Speciality { Category = Category.FinancieelEnBeheer, SpecialityType = "Subsidiemogelijkheden" },
        new Speciality { Category = Category.FinancieelEnBeheer, SpecialityType = "Verdeling middelen over verschillende campussen" },
        new Speciality { Category = Category.FinancieelEnBeheer, SpecialityType = "Aansturen technische equipe" }
    );
    }
}
