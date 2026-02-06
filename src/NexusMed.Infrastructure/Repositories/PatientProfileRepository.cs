using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class PatientProfileRepository : IPatientProfileRepository
{
    private readonly AppDbContext _db;

    public PatientProfileRepository(AppDbContext db) => _db = db;

    public async Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await _db.PatientProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<PatientProfile?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.PatientProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<PatientProfile>> ListAllAsync(CancellationToken ct = default) =>
        await _db.PatientProfiles.Include(p => p.User).OrderBy(p => p.FullName).ToListAsync(ct);

    public async Task<PatientProfile> AddAsync(PatientProfile profile, CancellationToken ct = default)
    {
        _db.PatientProfiles.Add(profile);
        await _db.SaveChangesAsync(ct);
        return profile;
    }

    public async Task UpdateAsync(PatientProfile profile, CancellationToken ct = default)
    {
        _db.PatientProfiles.Update(profile);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(PatientProfile profile, CancellationToken ct = default)
    {
        _db.PatientProfiles.Remove(profile);
        await _db.SaveChangesAsync(ct);
    }
}
