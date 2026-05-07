using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class VentaDetalleConfiguration : IEntityTypeConfiguration<VentaDetalle>
{
    public void Configure(EntityTypeBuilder<VentaDetalle> entity)
    {
        entity.ToTable("VENTA_DETALLE");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Cantidad).HasColumnType("decimal(18,2)");
        entity.Property(x => x.PrecioUnitario).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");

        entity.HasOne(x => x.Venta)
            .WithMany(x => x.Detalles)
            .HasForeignKey(x => x.VentaId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(x => x.Producto)
            .WithMany(x => x.VentaDetalles)
            .HasForeignKey(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
