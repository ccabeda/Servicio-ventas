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
        entity.Property(x => x.Email).HasMaxLength(120);
        entity.Property(x => x.DiasAtencion).HasMaxLength(4000);
        entity.Property(x => x.HorarioApertura).HasMaxLength(10);
        entity.Property(x => x.HorarioCierre).HasMaxLength(10);
        entity.Property(x => x.LogoUrl).HasMaxLength(500);
        entity.Property(x => x.ColorPrincipal).IsRequired().HasMaxLength(7).HasDefaultValue("#ef0000");
        entity.Property(x => x.ConfirmarEliminarItemCarrito).HasDefaultValue(true);
        entity.Property(x => x.MantenerClienteAlFinalizarVenta).HasDefaultValue(true);
        entity.Property(x => x.MostrarStockEnBusquedaProductos).HasDefaultValue(true);
        entity.Property(x => x.PedirCantidadAlAgregarProducto).HasDefaultValue(false);
        entity.Property(x => x.DescuentoMaximoPermitido).HasColumnType("decimal(18,2)").HasDefaultValue(20m);
        entity.Property(x => x.RedondeoTotal).IsRequired().HasMaxLength(10).HasDefaultValue("0.05");
        entity.Property(x => x.PedirMotivoCerrarCaja).HasDefaultValue(true);
        entity.Property(x => x.ImprimirResumenCerrarCaja).HasDefaultValue(true);
        entity.Property(x => x.MontoMinimoAperturaCaja).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
        entity.Property(x => x.FormatoFecha).IsRequired().HasMaxLength(20).HasDefaultValue("dd/MM/yyyy");
        entity.Property(x => x.FormatoHora).IsRequired().HasMaxLength(5).HasDefaultValue("24");
        entity.Property(x => x.MostrarMensajesAyuda).HasDefaultValue(true);
        entity.Property(x => x.EnviarEstadisticasAnonimas).HasDefaultValue(false);
    }
}
