using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using AccessAudit = NexusMed.Domain.Entities.AccessAudit;

namespace NexusMed.Application.Exams;

public class CreateExamUseCase
{
    private readonly IExamRepository _examRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public CreateExamUseCase(
        IExamRepository examRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IAccessAuditRepository accessAuditRepository)
    {
        _examRepository = examRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _accessAuditRepository = accessAuditRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateExamCommand command, Guid userId, string? ipAddress, CancellationToken ct = default)
    {
        _ = await _patientProfileRepository.GetByIdAsync(command.PatientId, ct)
            ?? throw new InvalidOperationException("Paciente não encontrado.");

        var requestedByProfessionalId = command.RequestedByProfessionalId;
        if (!requestedByProfessionalId.HasValue)
        {
            var prof = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
            if (prof != null) requestedByProfessionalId = prof.Id;
        }

        var exam = new Exam
        {
            Id = Guid.NewGuid(),
            PatientId = command.PatientId,
            RequestedByProfessionalId = requestedByProfessionalId,
            Name = command.Name,
            FilePath = command.FilePath,
            ExamDate = command.ExamDate,
            CreatedAt = DateTime.UtcNow
        };
        await _examRepository.AddAsync(exam, ct);

        await _accessAuditRepository.AddAsync(new AccessAudit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ResourceType = nameof(Exam),
            ResourceId = exam.Id,
            Action = "Create",
            OccurredAt = DateTime.UtcNow,
            IpAddress = ipAddress
        }, ct);

        return exam.Id;
    }
}
