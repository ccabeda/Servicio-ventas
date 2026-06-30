using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Configurations;

public class ConfiguracionNegocioConfiguration : IEntityTypeConfiguration<ConfiguracionNegocio>
{
    public void Configure(EntityTypeBuilder<ConfiguracionNegocio> builder)
    {
        builder.ToTable("CONFIGURACION_NEGOCIO");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.NombreNegocio).IsRequired().HasMaxLength(150);
        builder.Property(x => x.Direccion).HasMaxLength(200);
        builder.Property(x => x.Telefono).HasMaxLength(30);
        builder.Property(x => x.Email).HasMaxLength(120);
        builder.Property(x => x.DiasAtencion).HasMaxLength(4000);
        builder.Property(x => x.HorarioApertura).HasMaxLength(10);
        builder.Property(x => x.HorarioCierre).HasMaxLength(10);
        builder.Property(x => x.LogoUrl).HasMaxLength(500);
        builder.Property(x => x.ColorPrincipal).IsRequired().HasMaxLength(7).HasDefaultValue("#ef0000");
        builder.Property(x => x.ConfirmarEliminarItemCarrito).HasDefaultValue(true);
        builder.Property(x => x.MantenerClienteAlFinalizarVenta).HasDefaultValue(true);
        builder.Property(x => x.MostrarStockEnBusquedaProductos).HasDefaultValue(true);
        builder.Property(x => x.PedirCantidadAlAgregarProducto).HasDefaultValue(false);
        builder.Property(x => x.AplicarImpuestosEnVentas).HasDefaultValue(true);
        builder.Property(x => x.DescuentoMaximoPermitido).HasColumnType("decimal(18,2)").HasDefaultValue(20m);
        builder.Property(x => x.RedondeoTotal).IsRequired().HasMaxLength(10).HasDefaultValue("0.05");
        builder.Property(x => x.PedirMotivoCerrarCaja).HasDefaultValue(true);
        builder.Property(x => x.ImprimirResumenCerrarCaja).HasDefaultValue(true);
        builder.Property(x => x.MontoMinimoAperturaCaja).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
        builder.Property(x => x.FormatoFecha).IsRequired().HasMaxLength(20).HasDefaultValue("dd/MM/yyyy");
        builder.Property(x => x.FormatoHora).IsRequired().HasMaxLength(5).HasDefaultValue("24");
        builder.Property(x => x.MostrarMensajesAyuda).HasDefaultValue(true);
        builder.Property(x => x.EnviarEstadisticasAnonimas).HasDefaultValue(false);
    }
}

