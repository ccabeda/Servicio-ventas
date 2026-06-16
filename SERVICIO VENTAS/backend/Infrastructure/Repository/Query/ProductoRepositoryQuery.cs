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
            .Include(x => x.Categoria)
            .Include(x => x.Marca)
            .Where(x => x.Activo)
            .OrderBy(x => x.Nombre)
            .ToListAsync();
    }

    public async Task<(List<Producto> Items, int TotalItems)> GetPagedAsync(
        int pageIndex,
        int pageSize,
        string? search,
        int? categoriaId,
        int? marcaId,
        string estado)
    {
        var query = context.Productos
            .AsNoTracking()
            .Include(x => x.Categoria)
            .Include(x => x.Marca)
            .AsQueryable();

        query = estado switch
        {
            "todos" => query,
            "inactivos" => query.Where(x => !x.Activo),
            _ => query.Where(x => x.Activo)
        };

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x =>
                x.Nombre.Contains(term) ||
                (x.CodigoBarra != null && x.CodigoBarra.Contains(term)) ||
                (x.CodigoInterno != null && x.CodigoInterno.Contains(term)) ||
                (x.Categoria != null && x.Categoria.Nombre.Contains(term)) ||
                (x.Marca != null && x.Marca.Nombre.Contains(term)));
        }

        if (categoriaId.HasValue)
        {
            query = query.Where(x => x.CategoriaId == categoriaId.Value);
        }

        if (marcaId.HasValue)
        {
            query = query.Where(x => x.MarcaId == marcaId.Value);
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(x => x.Nombre)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Producto?> GetByIdAsync(int id)
    {
        return await context.Productos
            .Include(x => x.Categoria)
            .Include(x => x.Marca)
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
            x.Activo &&
            x.CodigoBarra == codigoBarra &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
    }

    public async Task<bool> ExistsByCodigoInternoAsync(string codigoInterno, int? excludeId = null)
    {
        return await context.Productos.AnyAsync(x =>
            x.Activo &&
            x.CodigoInterno == codigoInterno &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
    }
}
