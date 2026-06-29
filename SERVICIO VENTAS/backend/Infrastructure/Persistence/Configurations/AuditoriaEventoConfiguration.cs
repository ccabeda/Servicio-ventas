using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class AuditoriaEventoConfiguration : IEntityTypeConfiguration<AuditoriaEvento>
{
    public void Configure(EntityTypeBuilder<AuditoriaEvento> builder)
    {
        builder.ToTable("AUDITORIA_EVENTO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Fecha).IsRequired();
        builder.Property(x => x.Modulo).IsRequired().HasMaxLength(80);
        builder.Property(x => x.Accion).IsRequired().HasMaxLength(80);
        builder.Property(x => x.Entidad).IsRequired().HasMaxLength(100);
        builder.Property(x => x.EntidadId).HasMaxLength(80);
        builder.Property(x => x.Detalle).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ValoresAnterioresJson).HasColumnType("nvarchar(max)");
        builder.Property(x => x.ValoresNuevosJson).HasColumnType("nvarchar(max)");
        builder.Property(x => x.Ip).HasMaxLength(80);

        builder.HasOne(x => x.Usuario)
            .WithMany()
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.Fecha);
        builder.HasIndex(x => x.UsuarioId);
        builder.HasIndex(x => new { x.Modulo, x.Accion });
    }
}

