using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ClienteRepositoryQuery(ServicioVentasDbContext context) : IClienteRepositoryQuery
{
    public async Task<List<Cliente>> GetAllAsync() => await context.Clientes
        .AsNoTracking()
        .Where(x => x.Activo)
        .OrderBy(x => x.Nombre)
        .ToListAsync();

    public async Task<(List<Cliente> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado)
    {
        var query = context.Clientes
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
            query = query.Where(x =>
                x.Nombre.Contains(term) ||
                (x.Telefono != null && x.Telefono.Contains(term)));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(x => x.Nombre)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Cliente?> GetByIdAsync(int id) => await context.Clientes.FirstOrDefaultAsync(x => x.Id == id);
}
