using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Prescription>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task<IReadOnlyList<Prescription>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default);
    Task<Prescription> AddAsync(Prescription prescription, CancellationToken ct = default);
    Task DeleteByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task DeleteByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default);
}
