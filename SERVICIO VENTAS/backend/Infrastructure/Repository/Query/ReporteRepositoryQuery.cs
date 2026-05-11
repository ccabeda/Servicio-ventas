using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ReporteRepositoryQuery(ServicioVentasDbContext context) : IReporteRepositoryQuery
{
    public async Task<ResumenVentasDto> GetResumenVentasAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? usuarioId)
    {
        var ventas = FiltrarVentas(fechaDesde, fechaHasta, null, usuarioId, null);

        var resumenBase = await ventas
            .GroupBy(_ => 1)
            .Select(g => new
            {
                CantidadVentas = g.Count(),
                TotalVendido = g.Sum(x => x.Total),
                UnidadesVendidas = g.SelectMany(x => x.Detalles).Sum(d => d.Cantidad),
                GananciaEstimada = g.SelectMany(x => x.Detalles).Sum(d => (d.PrecioUnitario - d.Producto.Costo) * d.Cantidad),
                ProductosDistintosVendidos = g.SelectMany(x => x.Detalles).Select(d => d.ProductoId).Distinct().Count()
            })
            .FirstOrDefaultAsync();

        if (resumenBase is null)
        {
            return new ResumenVentasDto
            {
                FechaDesde = fechaDesde,
                FechaHasta = fechaHasta
            };
        }

        return new ResumenVentasDto
        {
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta,
            CantidadVentas = resumenBase.CantidadVentas,
            ProductosDistintosVendidos = resumenBase.ProductosDistintosVendidos,
            UnidadesVendidas = resumenBase.UnidadesVendidas,
            TotalVendido = resumenBase.TotalVendido,
            TicketPromedio = resumenBase.CantidadVentas == 0 ? 0 : resumenBase.TotalVendido / resumenBase.CantidadVentas,
            GananciaEstimada = resumenBase.GananciaEstimada
        };
    }

    public async Task<List<VentaReporteDto>> GetVentasPorPeriodoAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId)
    {
        return await FiltrarVentas(fechaDesde, fechaHasta, cajaId, usuarioId, medioPagoId)
            .OrderByDescending(x => x.Fecha)
            .Select(x => new VentaReporteDto
            {
                VentaId = x.Id,
                Fecha = x.Fecha,
                Total = x.Total,
                Subtotal = x.Subtotal,
                Descuento = x.Descuento,
                Recargo = x.Recargo,
                CajaId = x.CajaId,
                UsuarioId = x.UsuarioId,
                UsuarioNombre = x.Usuario.NombreUsuario,
                MedioPagoId = x.MedioPagoId,
                MedioPagoNombre = x.MedioPago.Nombre,
                ClienteId = x.ClienteId,
                ClienteNombre = x.Cliente != null ? x.Cliente.Nombre : null,
                CantidadItems = x.Detalles.Count,
                UnidadesVendidas = x.Detalles.Sum(d => d.Cantidad)
            })
            .ToListAsync();
    }

    public async Task<List<ProductoMasVendidoDto>> GetProductosMasVendidosAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? usuarioId, int top)
    {
        return await FiltrarVentas(fechaDesde, fechaHasta, null, usuarioId, null)
            .SelectMany(x => x.Detalles)
            .GroupBy(d => new { d.ProductoId, d.Producto.Nombre })
            .Select(g => new ProductoMasVendidoDto
            {
                ProductoId = g.Key.ProductoId,
                Nombre = g.Key.Nombre,
                CantidadVendida = g.Sum(x => x.Cantidad),
                ImporteVendido = g.Sum(x => x.Subtotal),
                GananciaEstimada = g.Sum(x => (x.PrecioUnitario - x.Producto.Costo) * x.Cantidad)
            })
            .OrderByDescending(x => x.CantidadVendida)
            .ThenByDescending(x => x.ImporteVendido)
            .Take(top)
            .ToListAsync();
    }

    private IQueryable<ServicioVentas.Domain.Models.Venta> FiltrarVentas(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId)
    {
        var query = context.Ventas
            .AsNoTracking()
            .Where(x => x.Estado == EstadoVenta.Confirmada)
            .Include(x => x.Usuario)
            .Include(x => x.MedioPago)
            .Include(x => x.Cliente)
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .AsQueryable();

        if (fechaDesde.HasValue)
            query = query.Where(x => x.Fecha >= fechaDesde.Value);

        if (fechaHasta.HasValue)
            query = query.Where(x => x.Fecha <= fechaHasta.Value);

        if (cajaId.HasValue)
            query = query.Where(x => x.CajaId == cajaId.Value);

        if (usuarioId.HasValue)
            query = query.Where(x => x.UsuarioId == usuarioId.Value);

        if (medioPagoId.HasValue)
            query = query.Where(x => x.MedioPagoId == medioPagoId.Value);

        return query;
    }
}
