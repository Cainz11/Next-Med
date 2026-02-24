using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class ClinicalNoteRepository : IClinicalNoteRepository
{
    private readonly AppDbContext _db;

    public ClinicalNoteRepository(AppDbContext db) => _db = db;

    public async Task<ClinicalNote?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.ClinicalNotes
            .Include(x => x.Patient).Include(x => x.Professional)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<ClinicalNote>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default) =>
        await _db.ClinicalNotes
            .Include(x => x.Professional)
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);

    public async Task<ClinicalNote> AddAsync(ClinicalNote note, CancellationToken ct = default)
    {
        _db.ClinicalNotes.Add(note);
        await _db.SaveChangesAsync(ct);
        return note;
    }

    public async Task UpdateAsync(ClinicalNote note, CancellationToken ct = default)
    {
        _db.ClinicalNotes.Update(note);
        await _db.SaveChangesAsync(ct);
    }
}
