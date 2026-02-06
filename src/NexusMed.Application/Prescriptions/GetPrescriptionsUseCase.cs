using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Prescriptions;

public class GetPrescriptionsUseCase
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public GetPrescriptionsUseCase(
        IPrescriptionRepository prescriptionRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IAccessAuditRepository accessAuditRepository)
    {
        _prescriptionRepository = prescriptionRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _accessAuditRepository = accessAuditRepository;
    }

    public async Task<IReadOnlyList<Prescription>> ExecuteAsync(Guid userId, string role, string? ipAddress, CancellationToken ct = default)
    {
        if (role == Application.Common.Roles.Patient)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
            var list = await _prescriptionRepository.GetByPatientIdAsync(patient.Id, ct);
            foreach (var p in list)
                await _accessAuditRepository.AddAsync(new AccessAudit
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ResourceType = nameof(Prescription),
                    ResourceId = p.Id,
                    Action = "Read",
                    OccurredAt = DateTime.UtcNow,
                    IpAddress = ipAddress
                }, ct);
            return list;
        }

        var professional = await _professionalProfileRepository.GetByUserIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var prescriptions = await _prescriptionRepository.GetByProfessionalIdAsync(professional.Id, ct);
        foreach (var p in prescriptions)
            await _accessAuditRepository.AddAsync(new AccessAudit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ResourceType = nameof(Prescription),
                ResourceId = p.Id,
                Action = "Read",
                OccurredAt = DateTime.UtcNow,
                IpAddress = ipAddress
            }, ct);
        return prescriptions;
    }
}
