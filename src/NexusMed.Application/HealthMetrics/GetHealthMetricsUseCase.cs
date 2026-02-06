using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.HealthMetrics;

public class GetHealthMetricsUseCase
{
    private readonly IHealthMetricRepository _healthMetricRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public GetHealthMetricsUseCase(
        IHealthMetricRepository healthMetricRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IAccessAuditRepository accessAuditRepository)
    {
        _healthMetricRepository = healthMetricRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _accessAuditRepository = accessAuditRepository;
    }

    public async Task<IReadOnlyList<HealthMetric>> ExecuteAsync(Guid userId, string role, Guid? patientId, DateTime? from, DateTime? to, string? ipAddress, CancellationToken ct = default)
    {
        Guid targetPatientId;
        if (role == Application.Common.Roles.Patient)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
            targetPatientId = patient.Id;
        }
        else
        {
            if (patientId == null)
                throw new InvalidOperationException("Profissional deve informar o paciente.");
            var patient = await _patientProfileRepository.GetByIdAsync(patientId.Value, ct)
                ?? throw new InvalidOperationException("Paciente não encontrado.");
            targetPatientId = patient.Id;
        }

        var list = await _healthMetricRepository.GetByPatientIdAsync(targetPatientId, from, to, ct);
        foreach (var m in list)
            await _accessAuditRepository.AddAsync(new AccessAudit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ResourceType = nameof(HealthMetric),
                ResourceId = m.Id,
                Action = "Read",
                OccurredAt = DateTime.UtcNow,
                IpAddress = ipAddress
            }, ct);
        return list;
    }
}
