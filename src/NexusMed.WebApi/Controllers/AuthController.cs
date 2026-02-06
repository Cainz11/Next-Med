using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Auth;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    [HttpPost("register/patient")]
    public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientRequest request, CancellationToken ct)
    {
        var command = new RegisterPatientCommand(
            request.Email,
            request.Password,
            request.FullName,
            request.DateOfBirth,
            request.Phone,
            request.DocumentNumber);
        var useCase = HttpContext.RequestServices.GetRequiredService<RegisterPatientUseCase>();
        try
        {
            var result = await useCase.ExecuteAsync(command, ct);
            return Ok(new AuthResponse(result));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("já cadastrado"))
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register/professional")]
    public async Task<IActionResult> RegisterProfessional([FromBody] RegisterProfessionalRequest request, CancellationToken ct)
    {
        var command = new RegisterProfessionalCommand(
            request.Email,
            request.Password,
            request.FullName,
            request.Crm,
            request.Specialty,
            request.Phone);
        var useCase = HttpContext.RequestServices.GetRequiredService<RegisterProfessionalUseCase>();
        try
        {
            var result = await useCase.ExecuteAsync(command, ct);
            return Ok(new AuthResponse(result));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("já cadastrado"))
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var useCase = HttpContext.RequestServices.GetRequiredService<LoginUseCase>();
        try
        {
            var result = await useCase.ExecuteAsync(command, ct);
            return Ok(new AuthResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Email ou senha inválidos." });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request, CancellationToken ct)
    {
        var useCase = HttpContext.RequestServices.GetRequiredService<RefreshTokenUseCase>();
        try
        {
            var result = await useCase.ExecuteAsync(request.RefreshToken, ct);
            return Ok(new AuthResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Refresh token inválido ou expirado." });
        }
    }
}

public record RegisterPatientRequest(string Email, string Password, string FullName, DateTime? DateOfBirth, string? Phone, string? DocumentNumber);
public record RegisterProfessionalRequest(string Email, string Password, string FullName, string? Crm, string? Specialty, string? Phone);
public record LoginRequest(string Email, string Password);
public record RefreshRequest(string RefreshToken);
public record AuthResponse(string AccessToken, string RefreshToken, DateTime RefreshTokenExpiresAt, Guid UserId, string Email, string Role)
{
    public AuthResponse(AuthResult r) : this(r.AccessToken, r.RefreshToken, r.RefreshTokenExpiresAt, r.UserId, r.Email, r.Role) { }
}
