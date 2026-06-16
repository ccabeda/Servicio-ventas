using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class CajaConfiguration : IEntityTypeConfiguration<Caja>
{
    public void Configure(EntityTypeBuilder<Caja> entity)
    {
        entity.ToTable("CAJA");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.MontoInicial).HasColumnType("decimal(18,2)");
        entity.Property(x => x.MontoFinal).HasColumnType("decimal(18,2)");
        entity.Property(x => x.Diferencia).HasColumnType("decimal(18,2)");
        entity.Property(x => x.MotivoCierre).HasMaxLength(300);
        entity.HasIndex(x => x.Abierta)
            .IsUnique()
            .HasFilter("[Abierta] = 1");

        entity.HasOne(x => x.UsuarioApertura)
            .WithMany(x => x.CajasAbiertas)
            .HasForeignKey(x => x.UsuarioAperturaId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.UsuarioCierre)
            .WithMany(x => x.CajasCerradas)
            .HasForeignKey(x => x.UsuarioCierreId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
