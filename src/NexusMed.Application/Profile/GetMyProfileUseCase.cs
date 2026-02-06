using NexusMed.Domain.Ports;

namespace NexusMed.Application.Profile;

public class GetMyProfileUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetMyProfileUseCase(
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<MyProfileDto?> ExecuteAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null) return null;

        if (user.Role == "Patient")
        {
            var profile = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            if (profile == null)
                return new MyProfileDto(user.Role, user.Email, "", null, null, null, null, null);
            return new MyProfileDto(
                user.Role,
                user.Email,
                profile.FullName,
                profile.DateOfBirth,
                profile.Phone,
                profile.DocumentNumber,
                null,
                null
            );
        }

        if (user.Role == "Professional")
        {
            var profile = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
            if (profile == null)
                return new MyProfileDto(user.Role, user.Email, "", null, null, null, null, null);
            return new MyProfileDto(
                user.Role,
                user.Email,
                profile.FullName,
                null,
                profile.Phone,
                null,
                profile.Crm,
                profile.Specialty
            );
        }

        return null;
    }
}

public record MyProfileDto(
    string Role,
    string Email,
    string FullName,
    DateTime? DateOfBirth,
    string? Phone,
    string? DocumentNumber,
    string? Crm,
    string? Specialty
);
