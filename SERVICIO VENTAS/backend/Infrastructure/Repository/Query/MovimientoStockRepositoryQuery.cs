using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class MovimientoStockRepositoryQuery(ServicioVentasDbContext context) : IMovimientoStockRepositoryQuery
{
    public async Task<List<MovimientoStock>> GetByProductoIdAsync(int productoId, int take)
    {
        return await context.MovimientosStock
            .AsNoTracking()
            .Include(x => x.Producto)
            .Include(x => x.Usuario)
            .Where(x => x.ProductoId == productoId)
            .OrderByDescending(x => x.Fecha)
            .Take(Math.Clamp(take, 1, 50))
            .ToListAsync();
    }

    public async Task<(List<MovimientoStock> Items, int TotalItems)> GetByProductoIdPagedAsync(int productoId, int pageIndex, int pageSize)
    {
        var query = context.MovimientosStock
            .AsNoTracking()
            .Include(x => x.Producto)
            .Include(x => x.Usuario)
            .Where(x => x.ProductoId == productoId);

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.Fecha)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }
}
