using Microsoft.EntityFrameworkCore;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence;

public class ServicioVentasDbContext(DbContextOptions<ServicioVentasDbContext> options) : DbContext(options)
{
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<CategoriaProducto> CategoriasProducto => Set<CategoriaProducto>();
    public DbSet<MarcaProducto> MarcasProducto => Set<MarcaProducto>();
    public DbSet<Venta> Ventas => Set<Venta>();
    public DbSet<VentaDetalle> VentaDetalles => Set<VentaDetalle>();
    public DbSet<Caja> Cajas => Set<Caja>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<MovimientoCaja> MovimientosCaja => Set<MovimientoCaja>();
    public DbSet<MovimientoStock> MovimientosStock => Set<MovimientoStock>();
    public DbSet<MedioPago> MediosPago => Set<MedioPago>();
    public DbSet<Impuesto> Impuestos => Set<Impuesto>();
    public DbSet<ConfiguracionNegocio> ConfiguracionesNegocio => Set<ConfiguracionNegocio>();
    public DbSet<ConfiguracionTicket> ConfiguracionesTicket => Set<ConfiguracionTicket>();
    public DbSet<Impresora> Impresoras => Set<Impresora>();
    public DbSet<AuditoriaEvento> AuditoriaEventos => Set<AuditoriaEvento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ServicioVentasDbContext).Assembly);
    }
}
