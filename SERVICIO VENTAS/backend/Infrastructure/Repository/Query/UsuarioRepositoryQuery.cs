using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class UsuarioRepositoryQuery(ServicioVentasDbContext context) : IUsuarioRepositoryQuery
{
    public async Task<List<Usuario>> GetAllAsync() => await context.Usuarios
        .AsNoTracking()
        .Where(x => x.Activo)
        .OrderBy(x => x.NombreUsuario)
        .ToListAsync();

    public async Task<(List<Usuario> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado)
    {
        var query = context.Usuarios
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
            query = query.Where(x => x.NombreUsuario.Contains(term));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(x => x.NombreUsuario)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Usuario?> GetByIdAsync(int id) => await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario) => await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.NombreUsuario == nombreUsuario);
    public async Task<bool> ExistsByNombreUsuarioAsync(string nombreUsuario, int? excludeId = null) =>
        await context.Usuarios.AnyAsync(x => x.NombreUsuario == nombreUsuario && (!excludeId.HasValue || x.Id != excludeId.Value));
}
