namespace NexusMed.Infrastructure.Auth;

public class JwtSettings
{
    public const string SectionName = "Jwt";
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "NexusMed";
    public string Audience { get; set; } = "NexusMed";
    public int AccessTokenMinutes { get; set; } = 15;
}
