using NexusMed.Domain.Ports;

namespace NexusMed.Application.Auth;

public class RefreshTokenUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IAuthTokenService _authTokenService;
    private readonly IRefreshTokenStore _refreshTokenStore;

    public RefreshTokenUseCase(
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IAuthTokenService authTokenService,
        IRefreshTokenStore refreshTokenStore)
    {
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _authTokenService = authTokenService;
        _refreshTokenStore = refreshTokenStore;
    }

    public async Task<AuthResult> ExecuteAsync(string refreshToken, CancellationToken ct = default)
    {
        var userId = await _refreshTokenStore.GetUserIdByRefreshTokenAsync(refreshToken, ct);
        if (userId == null)
            throw new UnauthorizedAccessException("Refresh token inválido ou expirado.");

        var user = await _userRepository.GetByIdAsync(userId.Value, ct)
            ?? throw new UnauthorizedAccessException("Usuário não encontrado.");

        var fullName = "";
        if (user.Role == "Patient")
        {
            var profile = await _patientProfileRepository.GetByUserIdAsync(user.Id, ct);
            fullName = profile?.FullName ?? "";
        }
        else if (user.Role == "Professional")
        {
            var profile = await _professionalProfileRepository.GetByUserIdAsync(user.Id, ct);
            fullName = profile?.FullName ?? "";
        }

        var newAccessToken = _authTokenService.GenerateAccessToken(user.Id, user.Email, user.Role);
        var newRefreshToken = _authTokenService.GenerateRefreshToken();
        var refreshExpires = DateTime.UtcNow.AddDays(7);
        await _refreshTokenStore.RevokeAsync(refreshToken, ct);
        await _refreshTokenStore.SaveAsync(user.Id, newRefreshToken, refreshExpires, ct);

        return new AuthResult(
            AccessToken: newAccessToken,
            RefreshToken: newRefreshToken,
            RefreshTokenExpiresAt: refreshExpires,
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role,
            FullName: fullName
        );
    }
}
