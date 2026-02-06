using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Messages;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetConversationsUseCase>();
        var list = await useCase.ExecuteAsync(userId, role, ct);
        return Ok(list.Select(c => new
        {
            c.Id,
            c.PatientId,
            c.ProfessionalId,
            PatientName = c.Patient?.FullName,
            ProfessionalName = c.Professional?.FullName,
            c.LastMessageAt,
            c.CreatedAt
        }));
    }

    [HttpPost("conversations")]
    public async Task<IActionResult> GetOrCreateConversation([FromBody] GetOrCreateConversationRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetOrCreateConversationUseCase>();
        var conversation = await useCase.ExecuteAsync(userId, request.ProfessionalId, ct);
        return Ok(new { conversation.Id, conversation.PatientId, conversation.ProfessionalId, conversation.CreatedAt });
    }

    /// <summary>Profissional inicia ou abre conversa com um paciente (patientId = ID do perfil do paciente).</summary>
    [HttpPost("conversations/with-patient")]
    public async Task<IActionResult> GetOrCreateConversationWithPatient([FromBody] GetOrCreateWithPatientRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        if (role != "Professional") return Forbid();
        var useCase = HttpContext.RequestServices.GetRequiredService<GetOrCreateConversationByProfessionalUseCase>();
        var conversation = await useCase.ExecuteAsync(userId, request.PatientId, ct);
        return Ok(new { conversation.Id, conversation.PatientId, conversation.ProfessionalId, conversation.CreatedAt });
    }

    [HttpGet("conversations/{conversationId:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid conversationId, [FromQuery] int skip = 0, [FromQuery] int take = 50, CancellationToken ct = default)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMessagesUseCase>();
        var list = await useCase.ExecuteAsync(conversationId, userId, skip, take, ct);
        return Ok(list.Select(m => new { m.Id, m.SenderUserId, m.Content, m.SentAt, m.Read }).Reverse());
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new SendMessageCommand(request.ConversationId, request.Content);
        var useCase = HttpContext.RequestServices.GetRequiredService<SendMessageUseCase>();
        var id = await useCase.ExecuteAsync(command, userId, ct);
        return Ok(new { id });
    }
}

public record GetOrCreateConversationRequest(Guid ProfessionalId);
public record GetOrCreateWithPatientRequest(Guid PatientId);
public record SendMessageRequest(Guid ConversationId, string Content);
