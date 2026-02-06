using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly AppDbContext _db;

    public ConversationRepository(AppDbContext db) => _db = db;

    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Conversations
            .Include(c => c.Patient).ThenInclude(p => p.User)
            .Include(c => c.Professional).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<Conversation?> GetOrCreateBetweenAsync(Guid patientId, Guid professionalId, CancellationToken ct = default)
    {
        var existing = await _db.Conversations
            .Include(c => c.Patient).ThenInclude(p => p.User)
            .Include(c => c.Professional).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.PatientId == patientId && c.ProfessionalId == professionalId, ct);
        if (existing != null) return existing;

        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            PatientId = patientId,
            ProfessionalId = professionalId,
            CreatedAt = DateTime.UtcNow
        };
        _db.Conversations.Add(conversation);
        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(conversation.Id, ct);
    }

    public async Task<IReadOnlyList<Conversation>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default) =>
        await _db.Conversations
            .Include(c => c.Professional)
            .Where(c => c.PatientId == patientId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Conversation>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default) =>
        await _db.Conversations
            .Include(c => c.Patient)
            .Where(c => c.ProfessionalId == professionalId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(ct);

    public async Task<Conversation> AddAsync(Conversation conversation, CancellationToken ct = default)
    {
        _db.Conversations.Add(conversation);
        await _db.SaveChangesAsync(ct);
        return conversation;
    }

    public async Task UpdateAsync(Conversation conversation, CancellationToken ct = default)
    {
        _db.Conversations.Update(conversation);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteByPatientIdAsync(Guid patientId, CancellationToken ct = default)
    {
        var conversationIds = await _db.Conversations.Where(c => c.PatientId == patientId).Select(c => c.Id).ToListAsync(ct);
        if (conversationIds.Count > 0)
        {
            await _db.Messages.Where(m => conversationIds.Contains(m.ConversationId)).ExecuteDeleteAsync(ct);
            await _db.Conversations.Where(c => c.PatientId == patientId).ExecuteDeleteAsync(ct);
        }
    }

    public async Task DeleteByProfessionalIdAsync(Guid professionalId, CancellationToken ct = default)
    {
        var conversationIds = await _db.Conversations.Where(c => c.ProfessionalId == professionalId).Select(c => c.Id).ToListAsync(ct);
        if (conversationIds.Count > 0)
        {
            await _db.Messages.Where(m => conversationIds.Contains(m.ConversationId)).ExecuteDeleteAsync(ct);
            await _db.Conversations.Where(c => c.ProfessionalId == professionalId).ExecuteDeleteAsync(ct);
        }
    }
}
