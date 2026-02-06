using NexusMed.Domain.Ports;

namespace NexusMed.Application.Auth;

public class LoginUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IAuthTokenService _authTokenService;
    private readonly IRefreshTokenStore _refreshTokenStore;

    public LoginUseCase(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IAuthTokenService authTokenService,
        IRefreshTokenStore refreshTokenStore)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _authTokenService = authTokenService;
        _refreshTokenStore = refreshTokenStore;
    }

    public async Task<AuthResult> ExecuteAsync(LoginCommand command, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByEmailAsync(command.Email.ToLowerInvariant(), ct)
            ?? throw new UnauthorizedAccessException("Email ou senha inválidos.");

        if (!_passwordHasher.Verify(command.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email ou senha inválidos.");

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
            Role: user.Role
        );
    }
}
