using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MovimientoCajaConfiguration : IEntityTypeConfiguration<MovimientoCaja>
{
    public void Configure(EntityTypeBuilder<MovimientoCaja> builder)
    {
        builder.ToTable("MOVIMIENTO_CAJA");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Concepto).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Monto).HasColumnType("decimal(18,2)");

        builder.HasOne(x => x.Caja)
            .WithMany(x => x.Movimientos)
            .HasForeignKey(x => x.CajaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Usuario)
            .WithMany(x => x.MovimientosCaja)
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

