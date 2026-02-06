using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Profile;

public class UpdatePatientProfileUseCase
{
    private readonly IPatientProfileRepository _patientProfileRepository;

    public UpdatePatientProfileUseCase(IPatientProfileRepository patientProfileRepository)
    {
        _patientProfileRepository = patientProfileRepository;
    }

    public async Task ExecuteAsync(Guid userId, UpdatePatientProfileCommand command, CancellationToken ct = default)
    {
        var profile = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
        if (profile == null)
        {
            profile = new PatientProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FullName = command.FullName.Trim(),
                DateOfBirth = command.DateOfBirth,
                Phone = string.IsNullOrWhiteSpace(command.Phone) ? null : command.Phone.Trim(),
                DocumentNumber = string.IsNullOrWhiteSpace(command.DocumentNumber) ? null : command.DocumentNumber.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            await _patientProfileRepository.AddAsync(profile, ct);
        }
        else
        {
            profile.FullName = command.FullName.Trim();
            profile.DateOfBirth = command.DateOfBirth;
            profile.Phone = string.IsNullOrWhiteSpace(command.Phone) ? null : command.Phone.Trim();
            profile.DocumentNumber = string.IsNullOrWhiteSpace(command.DocumentNumber) ? null : command.DocumentNumber.Trim();
            profile.UpdatedAt = DateTime.UtcNow;
            await _patientProfileRepository.UpdateAsync(profile, ct);
        }
    }
}
