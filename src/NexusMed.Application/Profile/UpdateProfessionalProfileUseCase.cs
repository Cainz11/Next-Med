using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Profile;

public class UpdateProfessionalProfileUseCase
{
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public UpdateProfessionalProfileUseCase(IProfessionalProfileRepository professionalProfileRepository)
    {
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task ExecuteAsync(Guid userId, UpdateProfessionalProfileCommand command, CancellationToken ct = default)
    {
        var profile = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
        if (profile == null)
        {
            profile = new ProfessionalProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FullName = command.FullName.Trim(),
                Crm = string.IsNullOrWhiteSpace(command.Crm) ? null : command.Crm.Trim(),
                Specialty = string.IsNullOrWhiteSpace(command.Specialty) ? null : command.Specialty.Trim(),
                Phone = string.IsNullOrWhiteSpace(command.Phone) ? null : command.Phone.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            await _professionalProfileRepository.AddAsync(profile, ct);
        }
        else
        {
            profile.FullName = command.FullName.Trim();
            profile.Crm = string.IsNullOrWhiteSpace(command.Crm) ? null : command.Crm.Trim();
            profile.Specialty = string.IsNullOrWhiteSpace(command.Specialty) ? null : command.Specialty.Trim();
            profile.Phone = string.IsNullOrWhiteSpace(command.Phone) ? null : command.Phone.Trim();
            profile.UpdatedAt = DateTime.UtcNow;
            await _professionalProfileRepository.UpdateAsync(profile, ct);
        }
    }
}
