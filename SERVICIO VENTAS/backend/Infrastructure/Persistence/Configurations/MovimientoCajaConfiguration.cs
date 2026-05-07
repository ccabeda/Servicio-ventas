using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MovimientoCajaConfiguration : IEntityTypeConfiguration<MovimientoCaja>
{
    public void Configure(EntityTypeBuilder<MovimientoCaja> entity)
    {
        entity.ToTable("MOVIMIENTO_CAJA");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Concepto).IsRequired().HasMaxLength(200);
        entity.Property(x => x.Monto).HasColumnType("decimal(18,2)");

        entity.HasOne(x => x.Caja)
            .WithMany(x => x.Movimientos)
            .HasForeignKey(x => x.CajaId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.Usuario)
            .WithMany(x => x.MovimientosCaja)
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
