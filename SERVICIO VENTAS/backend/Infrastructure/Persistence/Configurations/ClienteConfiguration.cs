using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> entity)
    {
        entity.ToTable("CLIENTE");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Nombre).IsRequired().HasMaxLength(150);
        entity.Property(x => x.Telefono).HasMaxLength(30);
        entity.Property(x => x.Deuda).HasColumnType("decimal(18,2)");
    }
}
