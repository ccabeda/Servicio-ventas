using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class VentaRepositoryQuery(ServicioVentasDbContext context) : IVentaRepositoryQuery
{
    public async Task<List<Venta>> GetAllAsync()
    {
        return await context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .OrderByDescending(x => x.Fecha)
            .ToListAsync();
    }

    public async Task<List<Venta>> GetByUsuarioAsync(int usuarioId)
    {
        return await context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .Where(x => x.UsuarioId == usuarioId)
            .OrderByDescending(x => x.Fecha)
            .ToListAsync();
    }

    public async Task<(List<Venta> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, int? usuarioId = null)
    {
        var query = context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .AsQueryable();

        if (usuarioId.HasValue)
        {
            query = query.Where(x => x.UsuarioId == usuarioId.Value);
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.Fecha)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Venta?> GetByIdAsync(int id)
    {
        return await context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
