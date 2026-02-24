using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _db;

    public AppointmentRepository(AppDbContext db) => _db = db;

    public async Task<Appointment?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Appointments
            .Include(x => x.Patient).Include(x => x.Professional)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<Appointment>> GetByPatientIdAsync(Guid patientId, DateTime? from, DateTime? to, string? status, CancellationToken ct = default)
    {
        var q = _db.Appointments.Include(x => x.Professional).Where(x => x.PatientId == patientId);
        if (from.HasValue) q = q.Where(x => x.ScheduledAt >= from.Value);
        if (to.HasValue) q = q.Where(x => x.ScheduledAt <= to.Value);
        if (!string.IsNullOrEmpty(status)) q = q.Where(x => x.Status == status);
        return await q.OrderByDescending(x => x.ScheduledAt).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByProfessionalIdAsync(Guid professionalId, DateTime? from, DateTime? to, string? status, CancellationToken ct = default)
    {
        var q = _db.Appointments.Include(x => x.Patient).Where(x => x.ProfessionalId == professionalId);
        if (from.HasValue) q = q.Where(x => x.ScheduledAt >= from.Value);
        if (to.HasValue) q = q.Where(x => x.ScheduledAt <= to.Value);
        if (!string.IsNullOrEmpty(status)) q = q.Where(x => x.Status == status);
        return await q.OrderByDescending(x => x.ScheduledAt).ToListAsync(ct);
    }

    public async Task<bool> SlotHasActiveAppointmentAsync(Guid slotId, CancellationToken ct = default) =>
        await _db.Appointments.AnyAsync(x => x.SlotId == slotId && x.Status != "Cancelled", ct);

    public async Task<Appointment> AddAsync(Appointment appointment, CancellationToken ct = default)
    {
        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync(ct);
        return appointment;
    }

    public async Task UpdateAsync(Appointment appointment, CancellationToken ct = default)
    {
        _db.Appointments.Update(appointment);
        await _db.SaveChangesAsync(ct);
    }
}
