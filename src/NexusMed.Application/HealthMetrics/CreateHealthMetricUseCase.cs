using NexusMed.Domain;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.HealthMetrics;

public class CreateHealthMetricUseCase
{
    private readonly IHealthMetricRepository _healthMetricRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public CreateHealthMetricUseCase(
        IHealthMetricRepository healthMetricRepository,
        IPatientProfileRepository patientProfileRepository,
        IAccessAuditRepository accessAuditRepository)
    {
        _healthMetricRepository = healthMetricRepository;
        _patientProfileRepository = patientProfileRepository;
        _accessAuditRepository = accessAuditRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateHealthMetricCommand command, Guid userId, string? ipAddress, CancellationToken ct = default)
    {
        var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Apenas pacientes podem registrar métricas de saúde.");

        if (!HealthMetricUnitExtensions.TryParseUnit(command.Unit, out var unit))
            throw new ArgumentException("Unidade inválida. Use uma das opções do formulário.");

        var unitString = unit == HealthMetricUnit.Nenhuma ? null : unit.ToUnitString();

        var metric = new HealthMetric
        {
            Id = Guid.NewGuid(),
            PatientId = patient.Id,
            MetricType = command.MetricType,
            Value = command.Value,
            Unit = unitString,
            Notes = command.Notes,
            RecordedAt = command.RecordedAt,
            CreatedAt = DateTime.UtcNow
        };
        await _healthMetricRepository.AddAsync(metric, ct);

        await _accessAuditRepository.AddAsync(new AccessAudit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ResourceType = nameof(HealthMetric),
            ResourceId = metric.Id,
            Action = "Create",
            OccurredAt = DateTime.UtcNow,
            IpAddress = ipAddress
        }, ct);

        return metric.Id;
    }
}
