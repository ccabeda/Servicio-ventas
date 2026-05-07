using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class VentaConfiguration : IEntityTypeConfiguration<Venta>
{
    public void Configure(EntityTypeBuilder<Venta> entity)
    {
        entity.ToTable("VENTA");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Descuento).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Recargo).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Total).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Observaciones).HasMaxLength(500);

        entity.HasOne(x => x.Caja)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.CajaId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.Usuario)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.Cliente)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.MedioPago)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.MedioPagoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
