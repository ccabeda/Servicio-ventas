using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> entity)
    {
        entity.ToTable("USUARIO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.NombreUsuario).IsRequired().HasMaxLength(100);
        entity.Property(x => x.PasswordHash).IsRequired().HasMaxLength(500);
        entity.HasIndex(x => x.NombreUsuario).IsUnique();
    }
}
