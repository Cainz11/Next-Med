using NexusMed.Domain.Ports;

namespace NexusMed.Application.ClinicalNotes;

public class GetClinicalNotesByPatientUseCase
{
    private readonly IClinicalNoteRepository _noteRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public GetClinicalNotesByPatientUseCase(
        IClinicalNoteRepository noteRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IAppointmentRepository appointmentRepository)
    {
        _noteRepository = noteRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<IReadOnlyList<ClinicalNoteDto>> ExecuteAsync(Guid patientId, Guid professionalUserId, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var appointments = await _appointmentRepository.GetByProfessionalIdAsync(professional.Id, null, null, null, ct);
        var hasAppointmentWithPatient = appointments.Any(a => a.PatientId == patientId);
        if (!hasAppointmentWithPatient)
        {
            var notes = await _noteRepository.GetByPatientIdAsync(patientId, ct);
            if (notes.Any(n => n.ProfessionalId == professional.Id))
                hasAppointmentWithPatient = true;
        }
        if (!hasAppointmentWithPatient)
            throw new UnauthorizedAccessException("Você não tem vínculo com este paciente.");
        var list = await _noteRepository.GetByPatientIdAsync(patientId, ct);
        return list.Select(n => new ClinicalNoteDto(n.Id, n.AppointmentId, n.PatientId, n.ProfessionalId, n.Content, n.NoteType, n.CreatedAt, n.UpdatedAt, n.Professional?.FullName)).ToList();
    }
}

public record ClinicalNoteDto(Guid Id, Guid? AppointmentId, Guid PatientId, Guid ProfessionalId, string Content, string NoteType, DateTime CreatedAt, DateTime? UpdatedAt, string? ProfessionalName);
