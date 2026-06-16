using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class AuditoriaEventoRepositoryQuery(ServicioVentasDbContext context) : IAuditoriaEventoRepositoryQuery
{
    public async Task<(List<AuditoriaEvento> Items, int TotalItems)> GetPagedAsync(
        int pageIndex,
        int pageSize,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        int? usuarioId,
        string? modulo,
        string? accion,
        string? search)
    {
        var query = context.AuditoriaEventos
            .AsNoTracking()
            .Include(x => x.Usuario)
            .AsQueryable();

        if (fechaDesde.HasValue)
            query = query.Where(x => x.Fecha >= fechaDesde.Value);

        if (fechaHasta.HasValue)
            query = query.Where(x => x.Fecha <= fechaHasta.Value);

        if (usuarioId.HasValue)
            query = query.Where(x => x.UsuarioId == usuarioId.Value);

        if (!string.IsNullOrWhiteSpace(modulo))
        {
            var value = modulo.Trim();
            query = query.Where(x => x.Modulo == value);
        }

        if (!string.IsNullOrWhiteSpace(accion))
        {
            var value = accion.Trim();
            query = query.Where(x => x.Accion == value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x =>
                x.Detalle.Contains(term) ||
                x.Entidad.Contains(term) ||
                (x.EntidadId != null && x.EntidadId.Contains(term)) ||
                (x.Usuario != null && x.Usuario.NombreUsuario.Contains(term)));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.Fecha)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<AuditoriaEvento?> GetByIdAsync(int id)
    {
        return await context.AuditoriaEventos
            .AsNoTracking()
            .Include(x => x.Usuario)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
