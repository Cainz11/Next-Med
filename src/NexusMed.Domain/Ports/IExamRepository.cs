using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IExamRepository
{
    Task<Exam?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Exam>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task<IReadOnlyList<Exam>> GetByRequestedByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default);
    Task<Exam> AddAsync(Exam exam, CancellationToken ct = default);
    Task ClearRequestedByProfessionalAsync(Guid professionalId, CancellationToken ct = default);
}
