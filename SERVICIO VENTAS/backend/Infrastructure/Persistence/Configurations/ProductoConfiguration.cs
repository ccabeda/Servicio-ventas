using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> builder)
    {
        builder.ToTable("PRODUCTO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).IsRequired().HasMaxLength(150);
        builder.Property(x => x.CodigoBarra).HasMaxLength(50);
        builder.Property(x => x.CodigoInterno).HasMaxLength(50);
        builder.Property(x => x.Precio).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Costo).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Stock).HasColumnType("decimal(18,2)");
        builder.HasOne(x => x.Categoria)
            .WithMany(x => x.Productos)
            .HasForeignKey(x => x.CategoriaId)
            .OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(x => x.Marca)
            .WithMany(x => x.Productos)
            .HasForeignKey(x => x.MarcaId)
            .OnDelete(DeleteBehavior.SetNull);
        builder.HasIndex(x => x.CodigoBarra).IsUnique().HasFilter("[CodigoBarra] IS NOT NULL");
        builder.HasIndex(x => x.CodigoInterno).IsUnique().HasFilter("[CodigoInterno] IS NOT NULL");
    }
}

