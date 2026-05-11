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

    public async Task<Cliente?> GetByIdAsync(int id) => await context.Clientes.FirstOrDefaultAsync(x => x.Id == id);
}
