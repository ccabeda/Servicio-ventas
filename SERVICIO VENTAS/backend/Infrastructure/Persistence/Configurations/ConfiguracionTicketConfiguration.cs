using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ConfiguracionTicketConfiguration : IEntityTypeConfiguration<ConfiguracionTicket>
{
    public void Configure(EntityTypeBuilder<ConfiguracionTicket> builder)
    {
        builder.ToTable("CONFIGURACION_TICKET");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ImpresoraNombreSistema).HasMaxLength(180);
        builder.Property(x => x.MensajeTicket).HasMaxLength(500);
        builder.Property(x => x.AnchoPapelMm).HasDefaultValue(80);
        builder.Property(x => x.UsaAnchoPersonalizado).HasDefaultValue(false);
        builder.Property(x => x.UsaTicketTermico).HasDefaultValue(true);
        builder.Property(x => x.VistaPreviaAntesImprimir).HasDefaultValue(true);
        builder.Property(x => x.ImprimirDatosNegocioTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirCopiaTicket).HasDefaultValue(false);
        builder.Property(x => x.LetraGrandePantallaTactil).HasDefaultValue(false);
        builder.Property(x => x.ImprimirFechaHoraTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirCajeroTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirNumeroTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirMedioPagoTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirSubtotalTotalTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirDescuentoRecargoTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirClienteTicket).HasDefaultValue(true);
        builder.Property(x => x.ImprimirMensajeCierreTicket).HasDefaultValue(true);
        builder.Property(x => x.CorteAutomatico).HasDefaultValue(true);

        builder.HasOne(x => x.Impresora)
            .WithMany()
            .HasForeignKey(x => x.ImpresoraId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

