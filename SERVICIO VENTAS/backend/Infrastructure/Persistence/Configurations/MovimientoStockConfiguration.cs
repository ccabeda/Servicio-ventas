using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MovimientoStockConfiguration : IEntityTypeConfiguration<MovimientoStock>
{
    public void Configure(EntityTypeBuilder<MovimientoStock> entity)
    {
        entity.ToTable("MOVIMIENTO_STOCK");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Tipo).HasConversion<string>().HasMaxLength(20);
        entity.Property(x => x.Cantidad).HasColumnType("decimal(18,2)");
        entity.Property(x => x.StockAnterior).HasColumnType("decimal(18,2)");
        entity.Property(x => x.StockNuevo).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Motivo).IsRequired().HasMaxLength(80);
        entity.Property(x => x.Observacion).HasMaxLength(250);
        entity.HasOne(x => x.Producto)
            .WithMany(x => x.MovimientosStock)
            .HasForeignKey(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(x => x.Usuario)
            .WithMany(x => x.MovimientosStock)
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => new { x.ProductoId, x.Fecha });
    }
}
