using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ImpuestoConfiguration : IEntityTypeConfiguration<Impuesto>
{
    private static readonly DateTime SeedDate = new(2026, 6, 29, 0, 0, 0, DateTimeKind.Utc);

    public void Configure(EntityTypeBuilder<Impuesto> builder)
    {
        builder.ToTable("IMPUESTO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).IsRequired().HasMaxLength(80);
        builder.Property(x => x.Porcentaje).HasColumnType("decimal(5,2)");
        builder.Property(x => x.Activo).HasDefaultValue(true);
        builder.Property(x => x.EsPredeterminado).HasDefaultValue(false);
        builder.HasIndex(x => x.Nombre).IsUnique();
        builder.HasIndex(x => x.EsPredeterminado)
            .IsUnique()
            .HasFilter("[EsPredeterminado] = 1");

        builder.HasData(
            new Impuesto { Id = 1, Nombre = "IVA General", Porcentaje = 21m, Activo = true, EsPredeterminado = true, FechaCreacion = SeedDate },
            new Impuesto { Id = 2, Nombre = "IVA Reducido", Porcentaje = 10.5m, Activo = true, EsPredeterminado = false, FechaCreacion = SeedDate },
            new Impuesto { Id = 3, Nombre = "Exento", Porcentaje = 0m, Activo = true, EsPredeterminado = false, FechaCreacion = SeedDate }
        );
    }
}
