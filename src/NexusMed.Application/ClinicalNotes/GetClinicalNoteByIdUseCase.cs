using NexusMed.Domain.Ports;

namespace NexusMed.Application.ClinicalNotes;

public class GetClinicalNoteByIdUseCase
{
    private readonly IClinicalNoteRepository _noteRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public GetClinicalNoteByIdUseCase(
        IClinicalNoteRepository noteRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IPatientProfileRepository patientProfileRepository,
        IAppointmentRepository appointmentRepository)
    {
        _noteRepository = noteRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _patientProfileRepository = patientProfileRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<ClinicalNoteDto?> ExecuteAsync(Guid noteId, Guid userId, string role, CancellationToken ct = default)
    {
        var note = await _noteRepository.GetByIdAsync(noteId, ct);
        if (note == null) return null;
        if (role == "Professional")
        {
            var professional = await _professionalProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new UnauthorizedAccessException("Perfil não encontrado.");
            if (note.ProfessionalId != professional.Id)
            {
                var appointments = await _appointmentRepository.GetByProfessionalIdAsync(professional.Id, null, null, null, ct);
                if (!appointments.Any(a => a.PatientId == note.PatientId))
                    throw new UnauthorizedAccessException("Acesso negado a esta evolução.");
            }
        }
        else if (role == "Patient")
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new UnauthorizedAccessException("Perfil não encontrado.");
            if (note.PatientId != patient.Id)
                throw new UnauthorizedAccessException("Acesso negado a esta evolução.");
        }
        return new ClinicalNoteDto(note.Id, note.AppointmentId, note.PatientId, note.ProfessionalId, note.Content, note.NoteType, note.CreatedAt, note.UpdatedAt, note.Professional?.FullName);
    }
}
