using NexusMed.Domain.Ports;

namespace NexusMed.Application.ClinicalNotes;

public class UpdateClinicalNoteUseCase
{
    private readonly IClinicalNoteRepository _noteRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public UpdateClinicalNoteUseCase(
        IClinicalNoteRepository noteRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _noteRepository = noteRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task ExecuteAsync(Guid noteId, Guid professionalUserId, string content, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var note = await _noteRepository.GetByIdAsync(noteId, ct)
            ?? throw new InvalidOperationException("Evolução não encontrada.");
        if (note.ProfessionalId != professional.Id)
            throw new UnauthorizedAccessException("Apenas o autor pode editar esta evolução.");
        note.Content = content;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.UpdateAsync(note, ct);
    }
}
