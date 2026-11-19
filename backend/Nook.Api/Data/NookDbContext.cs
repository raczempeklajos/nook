
using Microsoft.EntityFrameworkCore;
using Nook.Api.Models;

namespace Nook.Api.Data;

public class NookDbContext : DbContext
{
    public NookDbContext(
        DbContextOptions<NookDbContext> options
    ) : base(options)
    {
    }

    public DbSet<NookUser> Users => Set<NookUser>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NookUser>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.Property(user => user.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(user => user.Bio)
                .HasMaxLength(500);

            entity.Property(user => user.Status)
                .HasMaxLength(20);
        });
    }
}
