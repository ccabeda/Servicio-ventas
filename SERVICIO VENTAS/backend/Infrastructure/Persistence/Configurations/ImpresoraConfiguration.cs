using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ImpresoraConfiguration : IEntityTypeConfiguration<Impresora>
{
    public void Configure(EntityTypeBuilder<Impresora> builder)
    {
        builder.ToTable("IMPRESORA");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).IsRequired().HasMaxLength(120);
        builder.Property(x => x.NombreSistema).IsRequired().HasMaxLength(180);
        builder.Property(x => x.Modelo).HasMaxLength(120);
        builder.Property(x => x.Conexion).HasMaxLength(80);
        builder.Property(x => x.Puerto).HasMaxLength(80);
        builder.Property(x => x.Tipo).IsRequired().HasMaxLength(30).HasDefaultValue("Ticket");
        builder.Property(x => x.AnchoPapelMm).HasDefaultValue(80);
        builder.Property(x => x.EsPredeterminada).HasDefaultValue(false);
        builder.Property(x => x.CorteAutomatico).HasDefaultValue(true);
        builder.Property(x => x.DensidadImpresion).IsRequired().HasMaxLength(20).HasDefaultValue("Media");
        builder.Property(x => x.Activa).HasDefaultValue(true);
        builder.HasIndex(x => x.Nombre);
        builder.HasIndex(x => x.NombreSistema);
    }
}

