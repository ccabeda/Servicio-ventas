using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ConfiguracionNegocioConfiguration : IEntityTypeConfiguration<ConfiguracionNegocio>
{
    public void Configure(EntityTypeBuilder<ConfiguracionNegocio> entity)
    {
        entity.ToTable("CONFIGURACION_NEGOCIO");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.NombreNegocio).IsRequired().HasMaxLength(150);
        entity.Property(x => x.Direccion).HasMaxLength(200);
        entity.Property(x => x.Telefono).HasMaxLength(30);
        entity.Property(x => x.LogoUrl).HasMaxLength(500);
        entity.Property(x => x.MensajeTicket).HasMaxLength(500);
        entity.Property(x => x.ImpresoraTicket).HasMaxLength(150);
    }
}
