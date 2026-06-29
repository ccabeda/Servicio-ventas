using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class VentaDetalleConfiguration : IEntityTypeConfiguration<VentaDetalle>
{
    public void Configure(EntityTypeBuilder<VentaDetalle> builder)
    {
        builder.ToTable("VENTA_DETALLE");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Cantidad).HasColumnType("decimal(18,2)");
        builder.Property(x => x.PrecioUnitario).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");

        builder.HasOne(x => x.Venta)
            .WithMany(x => x.Detalles)
            .HasForeignKey(x => x.VentaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Producto)
            .WithMany(x => x.VentaDetalles)
            .HasForeignKey(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

