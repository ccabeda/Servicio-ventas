using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> entity)
    {
        entity.ToTable("PRODUCTO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Nombre).IsRequired().HasMaxLength(150);
        entity.Property(x => x.CodigoBarra).HasMaxLength(50);
        entity.Property(x => x.CodigoInterno).HasMaxLength(50);
        entity.Property(x => x.Precio).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Costo).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Stock).HasColumnType("decimal(18,2)");
        entity.HasIndex(x => x.CodigoBarra).IsUnique().HasFilter("[CodigoBarra] IS NOT NULL");
        entity.HasIndex(x => x.CodigoInterno).IsUnique().HasFilter("[CodigoInterno] IS NOT NULL");
    }
}
