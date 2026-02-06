using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Profile;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyProfile(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMyProfileUseCase>();
        var profile = await useCase.ExecuteAsync(userId, ct);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        if (role == "Patient")
        {
            var command = new UpdatePatientProfileCommand(
                request.FullName ?? "",
                request.DateOfBirth,
                request.Phone,
                request.DocumentNumber
            );
            var useCase = HttpContext.RequestServices.GetRequiredService<UpdatePatientProfileUseCase>();
            await useCase.ExecuteAsync(userId, command, ct);
        }
        else if (role == "Professional")
        {
            var command = new UpdateProfessionalProfileCommand(
                request.FullName ?? "",
                request.Crm,
                request.Specialty,
                request.Phone
            );
            var useCase = HttpContext.RequestServices.GetRequiredService<UpdateProfessionalProfileUseCase>();
            await useCase.ExecuteAsync(userId, command, ct);
        }
        else
            return BadRequest("Perfil não suportado.");

        return NoContent();
    }
}

public record UpdateProfileRequest(
    string? FullName,
    DateTime? DateOfBirth,
    string? Phone,
    string? DocumentNumber,
    string? Crm,
    string? Specialty
);
