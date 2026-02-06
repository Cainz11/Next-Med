using NexusMed.Domain.Ports;

namespace NexusMed.Application.Patients;

public class ListMyPatientsUseCase
{
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IExamRepository _examRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;

    public ListMyPatientsUseCase(
        IProfessionalProfileRepository professionalProfileRepository,
        IPrescriptionRepository prescriptionRepository,
        IConversationRepository conversationRepository,
        IExamRepository examRepository,
        IPatientProfileRepository patientProfileRepository)
    {
        _professionalProfileRepository = professionalProfileRepository;
        _prescriptionRepository = prescriptionRepository;
        _conversationRepository = conversationRepository;
        _examRepository = examRepository;
        _patientProfileRepository = patientProfileRepository;
    }

    public async Task<IReadOnlyList<PatientListItemDto>> ExecuteAsync(Guid professionalUserId, bool includeAllPatients, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");

        if (includeAllPatients)
        {
            var all = await _patientProfileRepository.ListAllAsync(ct);
            return all.Select(p => new PatientListItemDto(p.Id, p.UserId, p.FullName, p.User?.Email ?? "", p.Phone)).OrderBy(x => x.FullName).ToList();
        }

        var patientIds = new HashSet<Guid>();

        var prescriptions = await _prescriptionRepository.GetByProfessionalIdAsync(professional.Id, ct);
        foreach (var p in prescriptions) patientIds.Add(p.PatientId);

        var conversations = await _conversationRepository.GetByProfessionalIdAsync(professional.Id, ct);
        foreach (var c in conversations) patientIds.Add(c.PatientId);

        var exams = await _examRepository.GetByRequestedByProfessionalIdAsync(professional.Id, ct);
        foreach (var e in exams) patientIds.Add(e.PatientId);

        var result = new List<PatientListItemDto>();
        foreach (var id in patientIds)
        {
            var profile = await _patientProfileRepository.GetByIdAsync(id, ct);
            if (profile == null) continue;
            result.Add(new PatientListItemDto(
                profile.Id,
                profile.UserId,
                profile.FullName,
                profile.User?.Email ?? "",
                profile.Phone
            ));
        }

        return result.OrderBy(x => x.FullName).ToList();
    }
}

public record PatientListItemDto(Guid Id, Guid UserId, string FullName, string Email, string? Phone);
