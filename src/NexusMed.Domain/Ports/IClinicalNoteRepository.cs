using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IClinicalNoteRepository
{
    Task<ClinicalNote?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<ClinicalNote>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task<ClinicalNote> AddAsync(ClinicalNote note, CancellationToken ct = default);
    Task UpdateAsync(ClinicalNote note, CancellationToken ct = default);
}
