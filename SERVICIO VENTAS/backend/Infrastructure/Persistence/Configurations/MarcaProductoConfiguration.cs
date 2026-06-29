using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class MarcaProductoConfiguration : IEntityTypeConfiguration<MarcaProducto>
{
    public void Configure(EntityTypeBuilder<MarcaProducto> builder)
    {
        builder.ToTable("MARCA_PRODUCTO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Activa).HasDefaultValue(true);
        builder.HasIndex(x => x.Nombre).IsUnique();
    }
}

