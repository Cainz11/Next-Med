using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class ProfessionalProfileRepository : IProfessionalProfileRepository
{
    private readonly AppDbContext _db;

    public ProfessionalProfileRepository(AppDbContext db) => _db = db;

    public async Task<ProfessionalProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await _db.ProfessionalProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<ProfessionalProfile?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.ProfessionalProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<ProfessionalProfile> AddAsync(ProfessionalProfile profile, CancellationToken ct = default)
    {
        _db.ProfessionalProfiles.Add(profile);
        await _db.SaveChangesAsync(ct);
        return profile;
    }

    public async Task UpdateAsync(ProfessionalProfile profile, CancellationToken ct = default)
    {
        _db.ProfessionalProfiles.Update(profile);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(ProfessionalProfile profile, CancellationToken ct = default)
    {
        _db.ProfessionalProfiles.Remove(profile);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<ProfessionalProfile>> ListAsync(int skip, int take, CancellationToken ct = default) =>
        await _db.ProfessionalProfiles.Include(p => p.User).OrderBy(p => p.FullName).Skip(skip).Take(take).ToListAsync(ct);
}
