using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ImpresoraRepositoryQuery(ServicioVentasDbContext context) : IImpresoraRepositoryQuery
{
    public async Task<List<Impresora>> GetAllAsync()
    {
        return await context.Impresoras
            .AsNoTracking()
            .Where(x => x.Activa)
            .OrderByDescending(x => x.EsPredeterminada)
            .ThenBy(x => x.Nombre)
            .ToListAsync();
    }

    public async Task<List<Impresora>> GetActivasAsync()
    {
        return await context.Impresoras
            .AsNoTracking()
            .Where(x => x.Activa)
            .OrderByDescending(x => x.EsPredeterminada)
            .ThenBy(x => x.Nombre)
            .ToListAsync();
    }

    public async Task<Impresora?> GetByIdAsync(int id)
    {
        return await context.Impresoras.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Impresora?> GetPredeterminadaAsync()
    {
        return await context.Impresoras.FirstOrDefaultAsync(x => x.Activa && x.EsPredeterminada);
    }

    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null)
    {
        return await context.Impresoras.AnyAsync(x => x.Nombre == nombre && (!excludeId.HasValue || x.Id != excludeId.Value));
    }

    public async Task<bool> ExistsByNombreSistemaAsync(string nombreSistema, int? excludeId = null)
    {
        return await context.Impresoras.AnyAsync(x => x.NombreSistema == nombreSistema && (!excludeId.HasValue || x.Id != excludeId.Value));
    }
}
