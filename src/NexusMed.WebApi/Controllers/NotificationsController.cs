using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Notifications;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMy([FromQuery] bool unreadOnly = false, [FromQuery] int skip = 0, [FromQuery] int take = 20, CancellationToken ct = default)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMyNotificationsUseCase>();
        var (items, unreadCount) = await useCase.ExecuteAsync(userId, unreadOnly, skip, take, ct);
        return Ok(new { items, unreadCount });
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMyNotificationsUseCase>();
        var (_, unreadCount) = await useCase.ExecuteAsync(userId, true, 0, 1, ct);
        return Ok(new { unreadCount });
    }

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<MarkNotificationAsReadUseCase>();
        await useCase.ExecuteAsync(id, userId, ct);
        return NoContent();
    }

    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<MarkAllNotificationsAsReadUseCase>();
        await useCase.ExecuteAsync(userId, ct);
        return NoContent();
    }
}
