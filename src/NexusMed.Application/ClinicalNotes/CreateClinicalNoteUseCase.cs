using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.ClinicalNotes;

public class CreateClinicalNoteUseCase
{
    private readonly IClinicalNoteRepository _noteRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public CreateClinicalNoteUseCase(
        IClinicalNoteRepository noteRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _noteRepository = noteRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateClinicalNoteCommand command, Guid professionalUserId, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        _ = await _patientProfileRepository.GetByIdAsync(command.PatientId, ct)
            ?? throw new InvalidOperationException("Paciente não encontrado.");
        var note = new ClinicalNote
        {
            Id = Guid.NewGuid(),
            AppointmentId = command.AppointmentId,
            PatientId = command.PatientId,
            ProfessionalId = professional.Id,
            Content = command.Content ?? "",
            NoteType = command.NoteType ?? "Evolution",
            CreatedAt = DateTime.UtcNow
        };
        await _noteRepository.AddAsync(note, ct);
        return note.Id;
    }
}

public record CreateClinicalNoteCommand(Guid PatientId, Guid? AppointmentId, string? Content, string? NoteType);
