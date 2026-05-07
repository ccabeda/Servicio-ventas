using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class UsuarioRepositoryQuery(ServicioVentasDbContext context) : IUsuarioRepositoryQuery
{
    public async Task<List<Usuario>> GetAllAsync() => await context.Usuarios.AsNoTracking().OrderBy(x => x.NombreUsuario).ToListAsync();
    public async Task<Usuario?> GetByIdAsync(int id) => await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario) => await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.NombreUsuario == nombreUsuario);
    public async Task<bool> ExistsByNombreUsuarioAsync(string nombreUsuario, int? excludeId = null) =>
        await context.Usuarios.AnyAsync(x => x.NombreUsuario == nombreUsuario && (!excludeId.HasValue || x.Id != excludeId.Value));
}
