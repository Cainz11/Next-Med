using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class ExamRepository : IExamRepository
{
    private readonly AppDbContext _db;

    public ExamRepository(AppDbContext db) => _db = db;

    public async Task<Exam?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Exams.Include(e => e.Patient).FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<IReadOnlyList<Exam>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default) =>
        await _db.Exams.Where(e => e.PatientId == patientId).OrderByDescending(e => e.ExamDate).ToListAsync(ct);

    public async Task<IReadOnlyList<Exam>> GetByRequestedByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default) =>
        await _db.Exams.Where(e => e.RequestedByProfessionalId == professionalId).ToListAsync(ct);

    public async Task<Exam> AddAsync(Exam exam, CancellationToken ct = default)
    {
        _db.Exams.Add(exam);
        await _db.SaveChangesAsync(ct);
        return exam;
    }

    public async Task ClearRequestedByProfessionalAsync(Guid professionalId, CancellationToken ct = default) =>
        await _db.Exams
            .Where(e => e.RequestedByProfessionalId == professionalId)
            .ExecuteUpdateAsync(s => s.SetProperty(e => e.RequestedByProfessionalId, (Guid?)null), ct);
}
