using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ConfiguracionTicketConfiguration : IEntityTypeConfiguration<ConfiguracionTicket>
{
    public void Configure(EntityTypeBuilder<ConfiguracionTicket> entity)
    {
        entity.ToTable("CONFIGURACION_TICKET");
        entity.HasKey(x => x.Id);

        entity.Property(x => x.ImpresoraNombreSistema).HasMaxLength(180);
        entity.Property(x => x.MensajeTicket).HasMaxLength(500);
        entity.Property(x => x.AnchoPapelMm).HasDefaultValue(80);
        entity.Property(x => x.UsaAnchoPersonalizado).HasDefaultValue(false);
        entity.Property(x => x.UsaTicketTermico).HasDefaultValue(true);
        entity.Property(x => x.VistaPreviaAntesImprimir).HasDefaultValue(true);
        entity.Property(x => x.ImprimirDatosNegocioTicket).HasDefaultValue(true);
        entity.Property(x => x.ImprimirCopiaTicket).HasDefaultValue(false);
        entity.Property(x => x.LetraGrandePantallaTactil).HasDefaultValue(false);
        entity.Property(x => x.ImprimirFechaHoraTicket).HasDefaultValue(true);
        entity.Property(x => x.ImprimirCajeroTicket).HasDefaultValue(true);
        entity.Property(x => x.ImprimirNumeroTicket).HasDefaultValue(true);
        entity.Property(x => x.CorteAutomatico).HasDefaultValue(true);

        entity.HasOne(x => x.Impresora)
            .WithMany()
            .HasForeignKey(x => x.ImpresoraId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
