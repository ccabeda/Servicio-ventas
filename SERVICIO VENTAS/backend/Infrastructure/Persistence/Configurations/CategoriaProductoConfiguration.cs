using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class CategoriaProductoConfiguration : IEntityTypeConfiguration<CategoriaProducto>
{
    public void Configure(EntityTypeBuilder<CategoriaProducto> builder)
    {
        builder.ToTable("CATEGORIA_PRODUCTO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Icono).HasMaxLength(50);
        builder.Property(x => x.Color).HasMaxLength(20);
        builder.Property(x => x.Activo).HasDefaultValue(true);
        builder.HasIndex(x => x.Nombre).IsUnique();

        builder.HasData(
            new CategoriaProducto { Id = 1, Nombre = "Bebidas", Icono = "bottle", Color = "#2563eb", Activo = true },
            new CategoriaProducto { Id = 2, Nombre = "Almacen", Icono = "basket", Color = "#d97706", Activo = true },
            new CategoriaProducto { Id = 3, Nombre = "Lacteos", Icono = "milk", Color = "#2563eb", Activo = true },
            new CategoriaProducto { Id = 4, Nombre = "Limpieza", Icono = "cleaner", Color = "#16a34a", Activo = true },
            new CategoriaProducto { Id = 5, Nombre = "Panaderia", Icono = "bread", Color = "#ea580c", Activo = true },
            new CategoriaProducto { Id = 6, Nombre = "Golosinas", Icono = "candy", Color = "#9333ea", Activo = true },
            new CategoriaProducto { Id = 7, Nombre = "Otros", Icono = "more", Color = "#64748b", Activo = true }
        );
    }
}

