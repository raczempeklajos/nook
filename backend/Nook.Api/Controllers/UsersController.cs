
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nook.Api.Data;
using Nook.Api.Models;

namespace Nook.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly NookDbContext _context;

    public UsersController(NookDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<NookUser>>> GetUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .OrderBy(user => user.Username)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NookUser>> GetUser(Guid id)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<NookUser>> CreateUser(
        SaveUserRequest request
    )
    {
        var error = ValidateRequest(request);

        if (error is not null)
        {
            return BadRequest(error);
        }

        var user = new NookUser
        {
            Username = request.Username.Trim(),
            Bio = request.Bio.Trim(),
            Status = request.Status
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.Id },
            user
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<NookUser>> UpdateUser(
        Guid id,
        SaveUserRequest request
    )
    {
        var error = ValidateRequest(request);

        if (error is not null)
        {
            return BadRequest(error);
        }

        var user = await _context.Users.FindAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        user.Username = request.Username.Trim();
        user.Bio = request.Bio.Trim();
        user.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string? ValidateRequest(
        SaveUserRequest request
    )
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return "Username is required.";
        }

        if (request.Username.Trim().Length > 32)
        {
            return "Username must be at most 32 characters.";
        }

        if (request.Bio is null || request.Bio.Length > 160)
        {
            return "Bio must be at most 160 characters.";
        }

        if (request.Status is not (
            "online" or "away" or "dnd" or "invisible"
        ))
        {
            return "Invalid user status.";
        }

        return null;
    }
}

public class SaveUserRequest
{
    public string Username { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string Status { get; set; } = "online";
}
