using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ImpresoraConfiguration : IEntityTypeConfiguration<Impresora>
{
    public void Configure(EntityTypeBuilder<Impresora> entity)
    {
        entity.ToTable("IMPRESORA");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Nombre).IsRequired().HasMaxLength(120);
        entity.Property(x => x.NombreSistema).IsRequired().HasMaxLength(180);
        entity.Property(x => x.Modelo).HasMaxLength(120);
        entity.Property(x => x.Conexion).HasMaxLength(80);
        entity.Property(x => x.Puerto).HasMaxLength(80);
        entity.Property(x => x.Tipo).IsRequired().HasMaxLength(30).HasDefaultValue("Ticket");
        entity.Property(x => x.AnchoPapelMm).HasDefaultValue(80);
        entity.Property(x => x.EsPredeterminada).HasDefaultValue(false);
        entity.Property(x => x.CorteAutomatico).HasDefaultValue(true);
        entity.Property(x => x.DensidadImpresion).IsRequired().HasMaxLength(20).HasDefaultValue("Media");
        entity.Property(x => x.Activa).HasDefaultValue(true);
        entity.HasIndex(x => x.Nombre);
        entity.HasIndex(x => x.NombreSistema);
    }
}
