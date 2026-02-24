using NexusMed.Domain.Ports;

namespace NexusMed.Application.Lgpd;

public record ConsentStatusResult(bool? Accepted, DateTime? RecordedAt);

public class GetConsentStatusUseCase
{
    private readonly IConsentLogRepository _consentLogRepository;

    public GetConsentStatusUseCase(IConsentLogRepository consentLogRepository)
    {
        _consentLogRepository = consentLogRepository;
    }

    /// <summary>
    /// Retorna o status do último consentimento do usuário para a finalidade informada.
    /// Se não houver registro, retorna null em Accepted e RecordedAt.
    /// </summary>
    public async Task<ConsentStatusResult> ExecuteAsync(Guid userId, string purpose, CancellationToken ct = default)
    {
        var last = await _consentLogRepository.GetLastByUserAndPurposeAsync(userId, purpose, ct);
        if (last == null)
            return new ConsentStatusResult(null, null);
        return new ConsentStatusResult(last.Accepted, last.RecordedAt);
    }
}
