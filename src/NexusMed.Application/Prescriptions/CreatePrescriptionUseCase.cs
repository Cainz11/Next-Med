using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Prescriptions;

public class CreatePrescriptionUseCase
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAccessAuditRepository _accessAuditRepository;

    public CreatePrescriptionUseCase(
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

    public async Task<Guid> ExecuteAsync(CreatePrescriptionCommand command, Guid professionalUserId, string? ipAddress, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        _ = await _patientProfileRepository.GetByIdAsync(command.PatientId, ct)
            ?? throw new InvalidOperationException("Paciente não encontrado.");

        var prescription = new Prescription
        {
            Id = Guid.NewGuid(),
            PatientId = command.PatientId,
            ProfessionalId = professional.Id,
            Description = command.Description,
            FilePath = command.FilePath,
            IssuedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        await _prescriptionRepository.AddAsync(prescription, ct);

        await _accessAuditRepository.AddAsync(new Domain.Entities.AccessAudit
        {
            Id = Guid.NewGuid(),
            UserId = professionalUserId,
            ResourceType = nameof(Prescription),
            ResourceId = prescription.Id,
            Action = "Create",
            OccurredAt = DateTime.UtcNow,
            IpAddress = ipAddress
        }, ct);

        return prescription.Id;
    }
}
