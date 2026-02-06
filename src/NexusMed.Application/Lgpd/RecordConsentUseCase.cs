using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Lgpd;

public record RecordConsentCommand(string Purpose, bool Accepted);

public class RecordConsentUseCase
{
    private readonly IConsentLogRepository _consentLogRepository;

    public RecordConsentUseCase(IConsentLogRepository consentLogRepository)
    {
        _consentLogRepository = consentLogRepository;
    }

    public async Task ExecuteAsync(RecordConsentCommand command, Guid userId, string? ipAddress, CancellationToken ct = default)
    {
        var log = new ConsentLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Purpose = command.Purpose,
            Accepted = command.Accepted,
            RecordedAt = DateTime.UtcNow,
            IpAddress = ipAddress
        };
        await _consentLogRepository.AddAsync(log, ct);
    }
}
