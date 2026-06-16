using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class MedioPagoRepositoryQuery(ServicioVentasDbContext context) : IMedioPagoRepositoryQuery
{
    public async Task<List<MedioPago>> GetAllAsync() => await context.MediosPago
        .AsNoTracking()
        .Where(x => x.Activo)
        .OrderBy(x => x.Nombre)
        .ToListAsync();

    public async Task<(List<MedioPago> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado)
    {
        var query = context.MediosPago
            .AsNoTracking()
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
            query = query.Where(x => x.Nombre.Contains(term));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(x => x.Nombre)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<MedioPago?> GetByIdAsync(int id) => await context.MediosPago.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<MedioPago?> GetByNombreAsync(string nombre) => await context.MediosPago.FirstOrDefaultAsync(x => x.Nombre == nombre);
    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) =>
        await context.MediosPago.AnyAsync(x =>
            x.Activo &&
            x.Nombre == nombre &&
            (!excludeId.HasValue || x.Id != excludeId.Value));

    public async Task<int> CountActivosAsync() => await context.MediosPago.CountAsync(x => x.Activo);
}
