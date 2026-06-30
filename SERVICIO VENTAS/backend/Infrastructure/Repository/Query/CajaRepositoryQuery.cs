using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class CajaRepositoryQuery(ServicioVentasDbContext context) : ICajaRepositoryQuery
{
    public async Task<Caja?> GetCajaAbiertaAsync()
    {
        return await context.Cajas
            .AsNoTracking()
            .OrderByDescending(x => x.FechaApertura)
            .FirstOrDefaultAsync(x => x.Abierta);
    }

    public async Task<Caja?> GetByIdAsync(int id)
    {
        return await context.Cajas.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Caja>> GetHistorialAsync(int? usuarioAperturaId = null)
    {
        var query = context.Cajas
            .AsNoTracking()
            .AsQueryable();

        if (usuarioAperturaId.HasValue)
        {
            query = query.Where(x => x.UsuarioAperturaId == usuarioAperturaId.Value);
        }

        return await query
            .OrderByDescending(x => x.FechaApertura)
            .ToListAsync();
    }

    public async Task<(List<Caja> Items, int TotalItems)> GetHistorialPagedAsync(int pageIndex, int pageSize, int? usuarioAperturaId = null)
    {
        var query = context.Cajas
            .AsNoTracking()
            .AsQueryable();

        if (usuarioAperturaId.HasValue)
        {
            query = query.Where(x => x.UsuarioAperturaId == usuarioAperturaId.Value);
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.FechaApertura)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<List<MovimientoCaja>> GetMovimientosByCajaIdAsync(int cajaId)
    {
        return await context.MovimientosCaja
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId)
            .OrderBy(x => x.Fecha)
            .ToListAsync();
    }

    public async Task<(List<MovimientoCaja> Items, int TotalItems)> GetMovimientosByCajaIdPagedAsync(int cajaId, int pageIndex, int pageSize)
    {
        var query = context.MovimientosCaja
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId);

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.Fecha)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<decimal> GetSaldoSistemaByCajaIdAsync(int cajaId)
    {
        var montoInicial = await context.Cajas
            .AsNoTracking()
            .Where(x => x.Id == cajaId)
            .Select(x => x.MontoInicial)
            .FirstOrDefaultAsync();

        var ventasEfectivo = await context.Ventas
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId && EF.Functions.Like(x.MedioPago.Nombre, "%Efectivo%"))
            .SumAsync(x => x.Total);

        var movimientosManuales = await context.MovimientosCaja
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId && (x.Tipo == TipoMovimientoCaja.Ingreso || x.Tipo == TipoMovimientoCaja.Egreso))
            .SumAsync(x => x.Tipo == TipoMovimientoCaja.Egreso ? -x.Monto : x.Monto);

        return montoInicial + ventasEfectivo + movimientosManuales;
    }

    public async Task<List<CajaMedioPagoResumenDto>> GetVentasPorMedioPagoByCajaIdAsync(int cajaId)
    {
        return await context.Ventas
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId)
            .GroupBy(x => new { x.MedioPagoId, x.MedioPago.Nombre })
            .Select(group => new CajaMedioPagoResumenDto
            {
                MedioPagoId = group.Key.MedioPagoId,
                MedioPagoNombre = group.Key.Nombre,
                Total = group.Sum(x => x.Total),
                CantidadVentas = group.Count(),
                EsEfectivo = EF.Functions.Like(group.Key.Nombre, "%Efectivo%")
            })
            .OrderByDescending(x => x.EsEfectivo)
            .ThenBy(x => x.MedioPagoNombre)
            .ToListAsync();
    }
}
