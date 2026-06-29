using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MovimientoStockConfiguration : IEntityTypeConfiguration<MovimientoStock>
{
    public void Configure(EntityTypeBuilder<MovimientoStock> builder)
    {
        builder.ToTable("MOVIMIENTO_STOCK");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Tipo).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Cantidad).HasColumnType("decimal(18,2)");
        builder.Property(x => x.StockAnterior).HasColumnType("decimal(18,2)");
        builder.Property(x => x.StockNuevo).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Motivo).IsRequired().HasMaxLength(80);
        builder.Property(x => x.Observacion).HasMaxLength(250);
        builder.HasOne(x => x.Producto)
            .WithMany(x => x.MovimientosStock)
            .HasForeignKey(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.Usuario)
            .WithMany(x => x.MovimientosStock)
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => new { x.ProductoId, x.Fecha });
    }
}

