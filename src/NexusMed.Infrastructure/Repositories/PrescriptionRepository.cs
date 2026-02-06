using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly AppDbContext _db;

    public PrescriptionRepository(AppDbContext db) => _db = db;

    public async Task<Prescription?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Prescriptions.Include(p => p.Patient).Include(p => p.Professional).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<Prescription>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default) =>
        await _db.Prescriptions.Include(p => p.Professional).Where(p => p.PatientId == patientId).OrderByDescending(p => p.IssuedAt).ToListAsync(ct);

    public async Task<IReadOnlyList<Prescription>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default) =>
        await _db.Prescriptions.Include(p => p.Patient).Where(p => p.ProfessionalId == professionalId).OrderByDescending(p => p.IssuedAt).ToListAsync(ct);

    public async Task<Prescription> AddAsync(Prescription prescription, CancellationToken ct = default)
    {
        _db.Prescriptions.Add(prescription);
        await _db.SaveChangesAsync(ct);
        return prescription;
    }

    public async Task DeleteByPatientIdAsync(Guid patientId, CancellationToken ct = default) =>
        await _db.Prescriptions.Where(p => p.PatientId == patientId).ExecuteDeleteAsync(ct);

    public async Task DeleteByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default) =>
        await _db.Prescriptions.Where(p => p.ProfessionalId == professionalId).ExecuteDeleteAsync(ct);
}
