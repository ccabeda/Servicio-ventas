using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ConfiguracionNegocioRepositoryQuery(ServicioVentasDbContext context) : IConfiguracionNegocioRepositoryQuery
{
    public async Task<List<ConfiguracionNegocio>> GetAllAsync() => await context.ConfiguracionesNegocio.AsNoTracking().OrderBy(x => x.Id).ToListAsync();
    public async Task<ConfiguracionNegocio?> GetByIdAsync(int id) => await context.ConfiguracionesNegocio.FirstOrDefaultAsync(x => x.Id == id);
}
