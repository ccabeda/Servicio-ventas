using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.Tests.Support;

internal sealed class FakeProductoRepository : IProductoRepositoryQuery, IProductoRepositoryCommand
{
    public List<Producto> Productos { get; } = [];
    public int UpdateCount { get; private set; }
    public int SaveCount { get; private set; }

    public Task AddAsync(Producto producto)
    {
        Productos.Add(producto);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Producto producto)
    {
        UpdateCount++;
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }

    public Task<List<Producto>> GetAllAsync() => Task.FromResult(Productos);
    public Task<(List<Producto> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, int? categoriaId, int? marcaId, string estado) => Task.FromResult((Productos, Productos.Count));
    public Task<Producto?> GetByIdAsync(int id) => Task.FromResult(Productos.FirstOrDefault(x => x.Id == id));
    public Task<List<Producto>> GetByIdsAsync(List<int> ids) => Task.FromResult(Productos.Where(x => ids.Contains(x.Id)).ToList());
    public Task<bool> ExistsByCodigoBarraAsync(string codigoBarra, int? excludeId = null) => Task.FromResult(Productos.Any(x => x.Activo && x.CodigoBarra == codigoBarra && x.Id != excludeId));
    public Task<bool> ExistsByCodigoInternoAsync(string codigoInterno, int? excludeId = null) => Task.FromResult(Productos.Any(x => x.Activo && x.CodigoInterno == codigoInterno && x.Id != excludeId));
}

internal sealed class FakeMovimientoStockRepository : IMovimientoStockRepositoryCommand, IMovimientoStockRepositoryQuery
{
    public List<MovimientoStock> Movimientos { get; } = [];

    public Task AddAsync(MovimientoStock movimiento)
    {
        Movimientos.Add(movimiento);
        return Task.CompletedTask;
    }

    public Task<List<MovimientoStock>> GetByProductoIdAsync(int productoId, int take)
    {
        return Task.FromResult(Movimientos
            .Where(x => x.ProductoId == productoId)
            .OrderByDescending(x => x.Fecha)
            .Take(Math.Clamp(take, 1, 50))
            .ToList());
    }

    public Task<(List<MovimientoStock> Items, int TotalItems)> GetByProductoIdPagedAsync(int productoId, int pageIndex, int pageSize)
    {
        var query = Movimientos
            .Where(x => x.ProductoId == productoId)
            .OrderByDescending(x => x.Fecha)
            .ToList();
        var items = query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult((items, query.Count));
    }
}

internal sealed class FakeCajaRepository : ICajaRepositoryQuery, ICajaRepositoryCommand
{
    public Caja? CajaAbierta { get; set; }
    public List<Caja> Cajas { get; } = [];
    public List<MovimientoCaja> Movimientos { get; } = [];
    public decimal SaldoSistema { get; set; }

    public Task AddCajaAsync(Caja caja)
    {
        Cajas.Add(caja);
        CajaAbierta = caja.Abierta ? caja : CajaAbierta;
        return Task.CompletedTask;
    }

    public Task AddMovimientoAsync(MovimientoCaja movimiento)
    {
        Movimientos.Add(movimiento);
        return Task.CompletedTask;
    }

    public Task UpdateCajaAsync(Caja caja)
    {
        if (!caja.Abierta && CajaAbierta?.Id == caja.Id)
        {
            CajaAbierta = null;
        }

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => Task.CompletedTask;
    public Task<Caja?> GetCajaAbiertaAsync() => Task.FromResult(CajaAbierta);
    public Task<Caja?> GetByIdAsync(int id) => Task.FromResult(Cajas.FirstOrDefault(x => x.Id == id) ?? (CajaAbierta?.Id == id ? CajaAbierta : null));
    public Task<List<Caja>> GetHistorialAsync(int? usuarioAperturaId = null) => Task.FromResult(Cajas.Where(x => !usuarioAperturaId.HasValue || x.UsuarioAperturaId == usuarioAperturaId).ToList());

    public Task<(List<Caja> Items, int TotalItems)> GetHistorialPagedAsync(int pageIndex, int pageSize, int? usuarioAperturaId = null)
    {
        var query = Cajas
            .Where(x => !usuarioAperturaId.HasValue || x.UsuarioAperturaId == usuarioAperturaId.Value)
            .OrderByDescending(x => x.FechaApertura)
            .ToList();
        var items = query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult((items, query.Count));
    }

    public Task<List<MovimientoCaja>> GetMovimientosByCajaIdAsync(int cajaId) => Task.FromResult(Movimientos.Where(x => x.CajaId == cajaId).ToList());

    public Task<(List<MovimientoCaja> Items, int TotalItems)> GetMovimientosByCajaIdPagedAsync(int cajaId, int pageIndex, int pageSize)
    {
        var query = Movimientos
            .Where(x => x.CajaId == cajaId)
            .OrderByDescending(x => x.Fecha)
            .ToList();
        var items = query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult((items, query.Count));
    }

    public Task<decimal> GetSaldoSistemaByCajaIdAsync(int cajaId) => Task.FromResult(SaldoSistema);
}

internal sealed class FakeVentaRepository : IVentaRepositoryCommand
{
    public List<Venta> Ventas { get; } = [];
    public List<MovimientoCaja> Movimientos { get; } = [];

    public Task AddAsync(Venta venta)
    {
        Ventas.Add(venta);
        return Task.CompletedTask;
    }

    public Task AddMovimientoAsync(MovimientoCaja movimientoCaja)
    {
        Movimientos.Add(movimientoCaja);
        return Task.CompletedTask;
    }
}

internal sealed class FakeMedioPagoRepository : IMedioPagoRepositoryQuery
{
    public List<MedioPago> MediosPago { get; } = [];

    public Task<List<MedioPago>> GetAllAsync() => Task.FromResult(MediosPago);
    public Task<(List<MedioPago> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado) => Task.FromResult((MediosPago, MediosPago.Count));
    public Task<MedioPago?> GetByIdAsync(int id) => Task.FromResult(MediosPago.FirstOrDefault(x => x.Id == id));
    public Task<MedioPago?> GetByNombreAsync(string nombre) => Task.FromResult(MediosPago.FirstOrDefault(x => x.Nombre == nombre));
    public Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) => Task.FromResult(MediosPago.Any(x => x.Nombre == nombre && x.Id != excludeId));
    public Task<int> CountActivosAsync() => Task.FromResult(MediosPago.Count(x => x.Activo));
}

internal sealed class FakeClienteRepository : IClienteRepositoryQuery
{
    public List<Cliente> Clientes { get; } = [];

    public Task<List<Cliente>> GetAllAsync() => Task.FromResult(Clientes);
    public Task<(List<Cliente> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado) => Task.FromResult((Clientes, Clientes.Count));
    public Task<Cliente?> GetByIdAsync(int id) => Task.FromResult(Clientes.FirstOrDefault(x => x.Id == id));
}

internal sealed class FakeConfiguracionNegocioRepository : IConfiguracionNegocioRepositoryQuery
{
    public ConfiguracionNegocio? Principal { get; set; } = new();

    public Task<List<ConfiguracionNegocio>> GetAllAsync() => Task.FromResult(Principal is null ? [] : new List<ConfiguracionNegocio> { Principal });
    public Task<ConfiguracionNegocio?> GetByIdAsync(int id) => Task.FromResult(Principal?.Id == id ? Principal : null);
    public Task<ConfiguracionNegocio?> GetPrincipalAsync() => Task.FromResult(Principal);
}

internal sealed class FakeImpresoraRepository : IImpresoraRepositoryQuery, IImpresoraRepositoryCommand
{
    public List<Impresora> Impresoras { get; } = [];
    public int SaveCount { get; private set; }

    public Task AddAsync(Impresora impresora)
    {
        impresora.Id = impresora.Id == 0 ? Impresoras.Count + 1 : impresora.Id;
        Impresoras.Add(impresora);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Impresora impresora) => Task.CompletedTask;
    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }

    public Task<List<Impresora>> GetAllAsync() => Task.FromResult(Impresoras);
    public Task<List<Impresora>> GetActivasAsync() => Task.FromResult(Impresoras.Where(x => x.Activa).ToList());
    public Task<Impresora?> GetByIdAsync(int id) => Task.FromResult(Impresoras.FirstOrDefault(x => x.Id == id));
    public Task<Impresora?> GetPredeterminadaAsync() => Task.FromResult(Impresoras.FirstOrDefault(x => x.EsPredeterminada));
    public Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) => Task.FromResult(Impresoras.Any(x => x.Nombre == nombre && x.Id != excludeId));
    public Task<bool> ExistsByNombreSistemaAsync(string nombreSistema, int? excludeId = null) => Task.FromResult(Impresoras.Any(x => x.NombreSistema == nombreSistema && x.Id != excludeId));
}

internal sealed class FakeConfiguracionTicketRepository : IConfiguracionTicketRepositoryQuery, IConfiguracionTicketRepositoryCommand
{
    public ConfiguracionTicket? Principal { get; set; }
    public int SaveCount { get; private set; }

    public Task AddAsync(ConfiguracionTicket configuracion)
    {
        configuracion.Id = configuracion.Id == 0 ? 1 : configuracion.Id;
        Principal = configuracion;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(ConfiguracionTicket configuracion)
    {
        Principal = configuracion;
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }

    public Task<ConfiguracionTicket?> GetPrincipalAsync() => Task.FromResult(Principal);
    public Task<ConfiguracionTicket?> GetByIdAsync(int id) => Task.FromResult(Principal?.Id == id ? Principal : null);
}
