using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class CajaConfiguration : IEntityTypeConfiguration<Caja>
{
    public void Configure(EntityTypeBuilder<Caja> builder)
    {
        builder.ToTable("CAJA");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MontoInicial).HasColumnType("decimal(18,2)");
        builder.Property(x => x.MontoFinal).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Diferencia).HasColumnType("decimal(18,2)");
        builder.Property(x => x.MotivoCierre).HasMaxLength(300);
        builder.HasIndex(x => x.Abierta)
            .IsUnique()
            .HasFilter("[Abierta] = 1");

        builder.HasOne(x => x.UsuarioApertura)
            .WithMany(x => x.CajasAbiertas)
            .HasForeignKey(x => x.UsuarioAperturaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.UsuarioCierre)
            .WithMany(x => x.CajasCerradas)
            .HasForeignKey(x => x.UsuarioCierreId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

