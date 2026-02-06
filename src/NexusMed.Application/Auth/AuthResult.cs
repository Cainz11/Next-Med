namespace NexusMed.Application.Auth;

public record AuthResult(
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt,
    Guid UserId,
    string Email,
    string Role
);
