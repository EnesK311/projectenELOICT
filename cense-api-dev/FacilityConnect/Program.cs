using dotenv.net;
using FacilityConnect.Data;
using FacilityConnect.Interfaces;
using FacilityConnect.Model;
using FacilityConnect.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace FacilityConnect;

public class Program
{
    public static void Main(string[] args)
    {
        DotEnv.Load(options: new DotEnvOptions(probeForEnv: true));
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySQL(
                Environment.GetEnvironmentVariable("CONNECTION_STRING")!,
                mySqlOptions =>
                {
                    mySqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                }));

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
            options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
            options.DefaultScheme = IdentityConstants.ApplicationScheme;
        })
        .AddCookie(IdentityConstants.ApplicationScheme)
        .AddBearerToken(IdentityConstants.BearerScheme);

        builder.Services.AddAuthorization(options =>
        {
            var policy = new AuthorizationPolicyBuilder(IdentityConstants.ApplicationScheme, IdentityConstants.BearerScheme)
                .RequireAuthenticatedUser()
                .Build();

            options.DefaultPolicy = policy;
        });

        builder.Services.AddTransient<IEmailSender, EmailService>();

        builder.Services.Configure<IdentityOptions>(options =>
        {
            options.SignIn.RequireConfirmedEmail = true;
            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(3);
        });


        // Configure Identity
        builder.Services.AddIdentityCore<User>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 6;
            options.Password.RequiredUniqueChars = 1;

            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;

            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddApiEndpoints();

        // Add Controllers and Swagger
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo()
            {
                Version = "v1",
                Title = "Auth"
            });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                In = ParameterLocation.Header,
                Description = "Please enter a token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer",
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                 {
                     new OpenApiSecurityScheme
                     {
                         Reference = new OpenApiReference
                         {
                             Type = ReferenceType.SecurityScheme,
                             Id = "Bearer"
                         }
                     }, []
                 }
            });
        });

        // Configure CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:5173", "https://facilityconnect-dev-271540053456.europe-west1.run.app", "https://facilityconnect-staging-271540053456.europe-west1.run.app", "https://facilityconnect-prod-271540053456.europe-west1.run.app")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // Configure Application Cookies
        builder.Services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });

        // Register WebSocket services
        builder.Services.AddSingleton<ConcurrentDictionary<string, WebSocket>>();
        builder.Services.AddScoped<Services.WebSocketManager>();
        builder.Services.AddScoped<WebSocketHandler>();

        // Add LocationService and HttpClient
        builder.Services.AddHttpClient<ILocationService, LocationService>();
        builder.Services.AddScoped<ILocationService, LocationService>();

        // Add application-specific services
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<ICompanyService, CompanyService>();
        builder.Services.AddScoped<IChatService, ChatService>();
        builder.Services.AddScoped<IDbService, DbService>();
        builder.Services.AddScoped<ISwipeService, SwipeService>();

        builder.Services.AddScoped<IProfilePictureService, ProfilePictureService>();
        builder.Services.AddSingleton<ProfilePictureService>();

        var app = builder.Build();

        // Configure the middleware pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        
        // Configure WebSocket handling
        app.UseWebSockets(new WebSocketOptions
        {
            KeepAliveInterval = TimeSpan.FromMinutes(2),
            AllowedOrigins = {
                "http://localhost:5173", 
                "https://facilityconnect-dev-271540053456.europe-west1.run.app", 
                "https://facilityconnect-staging-271540053456.europe-west1.run.app", 
                "https://facilityconnect-prod-271540053456.europe-west1.run.app"
            }
        });

        app.UseCors("AllowFrontend");

        // Configure Authentication and Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        // WebSocket connection handler
        app.Use(async (context, next) =>
        {
            if (context.Request.Path == "/ws")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var token = context.Request.Query["token"];
                    string userEmail;
                    if (string.IsNullOrEmpty(token))
                    {
                        context.Response.StatusCode = 401; // Unauthorized
                        return;
                    }

                    try
                    {
                        using var userScope = context.RequestServices.CreateScope();
                        var userManager = userScope.ServiceProvider.GetRequiredService<UserManager<User>>();

                        var user = await userManager.FindByIdAsync(token!);
                        userEmail = user?.Email ?? "Unknown";
                        if (user == null)
                        {
                            context.Response.StatusCode = 401;
                            return;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error retrieving user: {ex.Message}");
                        context.Response.StatusCode = 401; // Unauthorized in case of an error
                        return;
                    }

                    using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    using var scope = app.Services.CreateScope();
                    var webSocketHandler = scope.ServiceProvider.GetRequiredService<WebSocketHandler>();

                    await webSocketHandler.HandleConnectionAsync(userEmail, webSocket);

                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
            else
            {
                await next();
            }
        });

        // Map controllers and identity endpoints
        app.MapControllers();
        app.MapIdentityApi<User>();

        app.Run();
    }
}