using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ImpuestoRepositoryQuery(ServicioVentasDbContext context) : IImpuestoRepositoryQuery
{
    public async Task<List<Impuesto>> GetAllAsync() => await context.Impuestos
        .AsNoTracking()
        .Where(x => x.Activo)
        .OrderByDescending(x => x.EsPredeterminado)
        .ThenBy(x => x.Nombre)
        .ToListAsync();

    public async Task<(List<Impuesto> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado)
    {
        var query = context.Impuestos.AsNoTracking().AsQueryable();

        query = estado switch
        {
            "todos" => query,
            "inactivos" => query.Where(x => !x.Activo),
            _ => query.Where(x => x.Activo)
        };

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x => x.Nombre.Contains(term));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.EsPredeterminado)
            .ThenBy(x => x.Nombre)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Impuesto?> GetByIdAsync(int id) => await context.Impuestos.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<Impuesto?> GetByNombreAsync(string nombre) => await context.Impuestos.FirstOrDefaultAsync(x => x.Nombre == nombre);
    public async Task<Impuesto?> GetPredeterminadoAsync() => await context.Impuestos.FirstOrDefaultAsync(x => x.EsPredeterminado);
    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) =>
        await context.Impuestos.AnyAsync(x =>
            x.Nombre == nombre &&
            (!excludeId.HasValue || x.Id != excludeId.Value));

    public async Task<int> CountActivosAsync() => await context.Impuestos.CountAsync(x => x.Activo);
    public async Task<int> CountProductosSinTasaAsync() => await context.Productos
        .CountAsync(x => x.Activo && x.ImpuestoId == null && (x.Categoria == null || x.Categoria.ImpuestoId == null));
}
