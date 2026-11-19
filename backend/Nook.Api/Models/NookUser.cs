
namespace Nook.Api.Models;

public class NookUser
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Username { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string Status { get; set; } = "online";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
