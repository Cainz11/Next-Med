using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByPatientIdAsync(Guid patientId, DateTime? from, DateTime? to, string? status, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByProfessionalIdAsync(Guid professionalId, DateTime? from, DateTime? to, string? status, CancellationToken ct = default);
    Task<bool> SlotHasActiveAppointmentAsync(Guid slotId, CancellationToken ct = default);
    Task<Appointment> AddAsync(Appointment appointment, CancellationToken ct = default);
    Task UpdateAsync(Appointment appointment, CancellationToken ct = default);
}
