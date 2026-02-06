using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Exams;

public class GetExamsUseCase
{
    private readonly IExamRepository _examRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public GetExamsUseCase(
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

    public async Task<IReadOnlyList<Exam>> ExecuteAsync(Guid userId, string role, Guid? patientId, string? ipAddress, CancellationToken ct = default)
    {
        if (role == Application.Common.Roles.Patient)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
            var list = await _examRepository.GetByPatientIdAsync(patient.Id, ct);
            foreach (var e in list)
                await _accessAuditRepository.AddAsync(new AccessAudit
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ResourceType = nameof(Exam),
                    ResourceId = e.Id,
                    Action = "Read",
                    OccurredAt = DateTime.UtcNow,
                    IpAddress = ipAddress
                }, ct);
            return list;
        }

        if (patientId == null)
            return Array.Empty<Exam>();
        var exams = await _examRepository.GetByPatientIdAsync(patientId.Value, ct);
        foreach (var e in exams)
            await _accessAuditRepository.AddAsync(new AccessAudit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ResourceType = nameof(Exam),
                ResourceId = e.Id,
                Action = "Read",
                OccurredAt = DateTime.UtcNow,
                IpAddress = ipAddress
            }, ct);
        return exams;
    }
}
