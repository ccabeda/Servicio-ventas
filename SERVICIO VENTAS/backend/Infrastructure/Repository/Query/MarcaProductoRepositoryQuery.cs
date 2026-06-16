using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class MarcaProductoRepositoryQuery(ServicioVentasDbContext context) : IMarcaProductoRepositoryQuery
{
    public async Task<List<MarcaProducto>> GetAllAsync() => await context.MarcasProducto
        .AsNoTracking()
        .Where(x => x.Activa)
        .OrderBy(x => x.Nombre)
        .ToListAsync();

    public async Task<MarcaProducto?> GetByIdAsync(int id) => await context.MarcasProducto.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<MarcaProducto?> GetByNombreAsync(string nombre) => await context.MarcasProducto.FirstOrDefaultAsync(x => x.Nombre == nombre);
    public async Task<bool> ExistsActiveAsync(int id) => await context.MarcasProducto.AnyAsync(x => x.Id == id && x.Activa);
    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) =>
        await context.MarcasProducto.AnyAsync(x =>
            x.Activa &&
            x.Nombre == nombre &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
}
