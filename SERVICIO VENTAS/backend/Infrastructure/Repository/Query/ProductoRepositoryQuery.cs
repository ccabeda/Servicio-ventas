using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ProductoRepositoryQuery(ServicioVentasDbContext context) : IProductoRepositoryQuery
{
    public async Task<List<Producto>> GetAllAsync()
    {
        return await context.Productos
            .AsNoTracking()
            .Where(x => x.Activo)
            .OrderBy(x => x.Nombre)
            .ToListAsync();
    }

    public async Task<Producto?> GetByIdAsync(int id)
    {
        return await context.Productos
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Producto>> GetByIdsAsync(List<int> ids)
    {
        return await context.Productos
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
    }

    public async Task<bool> ExistsByCodigoBarraAsync(string codigoBarra, int? excludeId = null)
    {
        return await context.Productos.AnyAsync(x =>
            x.CodigoBarra == codigoBarra &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
    }

    public async Task<bool> ExistsByCodigoInternoAsync(string codigoInterno, int? excludeId = null)
    {
        return await context.Productos.AnyAsync(x =>
            x.CodigoInterno == codigoInterno &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
    }
}
