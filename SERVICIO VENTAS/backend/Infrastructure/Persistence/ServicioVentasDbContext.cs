using Microsoft.EntityFrameworkCore;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence;

public class ServicioVentasDbContext(DbContextOptions<ServicioVentasDbContext> options) : DbContext(options)
{
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Venta> Ventas => Set<Venta>();
    public DbSet<VentaDetalle> VentaDetalles => Set<VentaDetalle>();
    public DbSet<Caja> Cajas => Set<Caja>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<MovimientoCaja> MovimientosCaja => Set<MovimientoCaja>();
    public DbSet<MedioPago> MediosPago => Set<MedioPago>();
    public DbSet<ConfiguracionNegocio> ConfiguracionesNegocio => Set<ConfiguracionNegocio>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ServicioVentasDbContext).Assembly);
    }
}
