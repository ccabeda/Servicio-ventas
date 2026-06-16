using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
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
        return await context.MovimientosCaja
            .AsNoTracking()
            .Where(x => x.CajaId == cajaId)
            .SumAsync(x => x.Tipo == ServicioVentas.Domain.Enums.TipoMovimientoCaja.Egreso ? -x.Monto : x.Monto);
    }
}
