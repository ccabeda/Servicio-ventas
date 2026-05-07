using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MedioPagoConfiguration : IEntityTypeConfiguration<MedioPago>
{
    public void Configure(EntityTypeBuilder<MedioPago> entity)
    {
        entity.ToTable("MEDIO_PAGO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Nombre).IsRequired().HasMaxLength(100);
        entity.HasIndex(x => x.Nombre).IsUnique();
    }
}
