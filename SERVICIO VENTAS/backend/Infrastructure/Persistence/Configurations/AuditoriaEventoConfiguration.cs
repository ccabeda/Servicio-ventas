using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class AuditoriaEventoConfiguration : IEntityTypeConfiguration<AuditoriaEvento>
{
    public void Configure(EntityTypeBuilder<AuditoriaEvento> entity)
    {
        entity.ToTable("AUDITORIA_EVENTO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Fecha).IsRequired();
        entity.Property(x => x.Modulo).IsRequired().HasMaxLength(80);
        entity.Property(x => x.Accion).IsRequired().HasMaxLength(80);
        entity.Property(x => x.Entidad).IsRequired().HasMaxLength(100);
        entity.Property(x => x.EntidadId).HasMaxLength(80);
        entity.Property(x => x.Detalle).IsRequired().HasMaxLength(500);
        entity.Property(x => x.ValoresAnterioresJson).HasColumnType("nvarchar(max)");
        entity.Property(x => x.ValoresNuevosJson).HasColumnType("nvarchar(max)");
        entity.Property(x => x.Ip).HasMaxLength(80);

        entity.HasOne(x => x.Usuario)
            .WithMany()
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        entity.HasIndex(x => x.Fecha);
        entity.HasIndex(x => x.UsuarioId);
        entity.HasIndex(x => new { x.Modulo, x.Accion });
    }
}
