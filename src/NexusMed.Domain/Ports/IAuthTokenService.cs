namespace NexusMed.Domain.Ports;

public interface IAuthTokenService
{
    string GenerateAccessToken(Guid userId, string email, string role);
    string GenerateRefreshToken();
    (Guid? userId, string? role) ValidateAccessToken(string token);
}
