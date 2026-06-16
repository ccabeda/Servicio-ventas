using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class ConfiguracionTicketRepositoryQuery(ServicioVentasDbContext context) : IConfiguracionTicketRepositoryQuery
{
    public async Task<ConfiguracionTicket?> GetPrincipalAsync() =>
        await context.ConfiguracionesTicket
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

    public async Task<ConfiguracionTicket?> GetByIdAsync(int id) =>
        await context.ConfiguracionesTicket.FirstOrDefaultAsync(x => x.Id == id);
}
