using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Conversation?> GetOrCreateBetweenAsync(Guid patientId, Guid professionalId, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default);
    Task<Conversation> AddAsync(Conversation conversation, CancellationToken ct = default);
    Task UpdateAsync(Conversation conversation, CancellationToken ct = default);
    Task DeleteByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task DeleteByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default);
}
