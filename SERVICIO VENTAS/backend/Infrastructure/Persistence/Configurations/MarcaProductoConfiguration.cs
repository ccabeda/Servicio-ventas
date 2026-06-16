using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MarcaProductoConfiguration : IEntityTypeConfiguration<MarcaProducto>
{
    public void Configure(EntityTypeBuilder<MarcaProducto> entity)
    {
        entity.ToTable("MARCA_PRODUCTO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Nombre).IsRequired().HasMaxLength(100);
        entity.Property(x => x.Activa).HasDefaultValue(true);
        entity.HasIndex(x => x.Nombre).IsUnique();
    }
}
