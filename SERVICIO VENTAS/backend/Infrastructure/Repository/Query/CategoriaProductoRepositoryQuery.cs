using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class CategoriaProductoRepositoryQuery(ServicioVentasDbContext context) : ICategoriaProductoRepositoryQuery
{
    public async Task<List<CategoriaProducto>> GetAllAsync() => await context.CategoriasProducto
        .AsNoTracking()
        .Where(x => x.Activo)
        .OrderBy(x => x.Nombre)
        .ToListAsync();

    public async Task<CategoriaProducto?> GetByIdAsync(int id) => await context.CategoriasProducto.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<CategoriaProducto?> GetByNombreAsync(string nombre) => await context.CategoriasProducto.FirstOrDefaultAsync(x => x.Nombre == nombre);
    public async Task<bool> ExistsAsync(int id) => await context.CategoriasProducto.AnyAsync(x => x.Id == id && x.Activo);
    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) =>
        await context.CategoriasProducto.AnyAsync(x =>
            x.Activo &&
            x.Nombre == nombre &&
            (!excludeId.HasValue || x.Id != excludeId.Value));
}
