using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NexusMed.Application.Auth;
using NexusMed.Application.Common;
using NexusMed.Application.Exams;
using NexusMed.Application.HealthMetrics;
using NexusMed.Application.Lgpd;
using NexusMed.Application.Messages;
using NexusMed.Application.Patients;
using NexusMed.Application.Prescriptions;
using NexusMed.Application.Profile;
using NexusMed.Application.Professionals;
using NexusMed.Application.Ratings;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Auth;
using NexusMed.Infrastructure.Persistence;
using NexusMed.Infrastructure.Repositories;

namespace NexusMed.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var rawConnection = configuration.GetConnectionString("DefaultConnection");
        var connectionString = string.IsNullOrWhiteSpace(rawConnection)
            ? "Data Source=nexusmed.db"
            : rawConnection;
        var providerConfig = configuration["DatabaseProvider"];
        var provider = string.IsNullOrWhiteSpace(providerConfig)
            ? InferProvider(connectionString)
            : providerConfig;

        // LocalDB só existe no Windows (ex.: Railway/Render usam Linux)
        if (connectionString.Contains("(localdb)", StringComparison.OrdinalIgnoreCase) && !OperatingSystem.IsWindows())
        {
            connectionString = "Data Source=nexusmed.db";
            provider = "Sqlite";
        }
        services.AddDbContext<AppDbContext>(options =>
        {
            switch (provider)
            {
                case "SqlServer":
                    options.UseSqlServer(connectionString);
                    break;
                case "PostgreSQL":
                case "Npgsql":
                    options.UseNpgsql(connectionString);
                    break;
                default:
                    options.UseSqlite(connectionString);
                    break;
            }
        });

        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPatientProfileRepository, PatientProfileRepository>();
        services.AddScoped<IProfessionalProfileRepository, ProfessionalProfileRepository>();
        services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IHealthMetricRepository, HealthMetricRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<IConsentLogRepository, ConsentLogRepository>();
        services.AddScoped<IAccessAuditRepository, AccessAuditRepository>();
        services.AddScoped<IRefreshTokenStore, RefreshTokenStore>();
        services.AddScoped<IUserDataCleanup, UserDataCleanup>();

        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IAuthTokenService, JwtAuthTokenService>();

        services.AddScoped<RegisterPatientUseCase>();
        services.AddScoped<RegisterProfessionalUseCase>();
        services.AddScoped<LoginUseCase>();
        services.AddScoped<RefreshTokenUseCase>();
        services.AddScoped<CreatePrescriptionUseCase>();
        services.AddScoped<GetPrescriptionsUseCase>();
        services.AddScoped<CreateExamUseCase>();
        services.AddScoped<GetExamsUseCase>();
        services.AddScoped<CreateHealthMetricUseCase>();
        services.AddScoped<GetHealthMetricsUseCase>();
        services.AddScoped<SendMessageUseCase>();
        services.AddScoped<GetOrCreateConversationUseCase>();
        services.AddScoped<GetOrCreateConversationByProfessionalUseCase>();
        services.AddScoped<GetConversationsUseCase>();
        services.AddScoped<GetMessagesUseCase>();
        services.AddScoped<CreateRatingUseCase>();
        services.AddScoped<GetProfessionalRatingsUseCase>();
        services.AddScoped<ListProfessionalsUseCase>();
        services.AddScoped<ListMyPatientsUseCase>();
        services.AddScoped<ExportMyDataUseCase>();
        services.AddScoped<DeleteMyAccountUseCase>();
        services.AddScoped<RecordConsentUseCase>();
        services.AddScoped<GetMyProfileUseCase>();
        services.AddScoped<UpdatePatientProfileUseCase>();
        services.AddScoped<UpdateProfessionalProfileUseCase>();

        return services;
    }

    private static string InferProvider(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString)) return "Sqlite";
        var cs = connectionString.Trim();
        if (cs.EndsWith(".db", StringComparison.OrdinalIgnoreCase) || cs.Contains("Data Source=") && cs.Contains(".db"))
            return "Sqlite";
        if (cs.Contains("Initial Catalog=", StringComparison.OrdinalIgnoreCase) || cs.Contains("Server=", StringComparison.OrdinalIgnoreCase))
            return "SqlServer";
        if (cs.Contains("Host=", StringComparison.OrdinalIgnoreCase) || cs.Contains("Database=") && cs.Contains("Port="))
            return "Npgsql";
        return "Sqlite";
    }
}
