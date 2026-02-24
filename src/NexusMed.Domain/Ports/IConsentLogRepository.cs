using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IConsentLogRepository
{
    Task AddAsync(ConsentLog log, CancellationToken ct = default);
    /// <summary>Retorna o último registro de consentimento do usuário para a finalidade informada (por data decrescente).</summary>
    Task<ConsentLog?> GetLastByUserAndPurposeAsync(Guid userId, string purpose, CancellationToken ct = default);
}
