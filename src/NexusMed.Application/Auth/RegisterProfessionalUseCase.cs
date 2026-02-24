using NexusMed.Application.Common;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Auth;

public class RegisterProfessionalUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IAuthTokenService _authTokenService;
    private readonly IRefreshTokenStore _refreshTokenStore;

    public RegisterProfessionalUseCase(
        IUserRepository userRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IPasswordHasher passwordHasher,
        IAuthTokenService authTokenService,
        IRefreshTokenStore refreshTokenStore)
    {
        _userRepository = userRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _passwordHasher = passwordHasher;
        _authTokenService = authTokenService;
        _refreshTokenStore = refreshTokenStore;
    }

    public async Task<AuthResult> ExecuteAsync(RegisterProfessionalCommand command, CancellationToken ct = default)
    {
        if (await _userRepository.GetByEmailAsync(command.Email, ct) != null)
            throw new InvalidOperationException("Email já cadastrado.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = command.Email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.Hash(command.Password),
            Role = Roles.Professional,
            CreatedAt = DateTime.UtcNow,
            EmailConfirmed = false
        };
        await _userRepository.AddAsync(user, ct);

        var profile = new ProfessionalProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FullName = command.FullName,
            Crm = command.Crm,
            Specialty = command.Specialty,
            Phone = command.Phone,
            CreatedAt = DateTime.UtcNow
        };
        await _professionalProfileRepository.AddAsync(profile, ct);

        var accessToken = _authTokenService.GenerateAccessToken(user.Id, user.Email, user.Role);
        var refreshToken = _authTokenService.GenerateRefreshToken();
        var refreshExpires = DateTime.UtcNow.AddDays(7);
        await _refreshTokenStore.SaveAsync(user.Id, refreshToken, refreshExpires, ct);

        return new AuthResult(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            RefreshTokenExpiresAt: refreshExpires,
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role,
            FullName: command.FullName
        );
    }
}
