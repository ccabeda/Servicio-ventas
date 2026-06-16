using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ConfiguracionTicketRepositoryCommand(ServicioVentasDbContext context) : IConfiguracionTicketRepositoryCommand
{
    public async Task AddAsync(ConfiguracionTicket configuracion) => await context.ConfiguracionesTicket.AddAsync(configuracion);

    public Task UpdateAsync(ConfiguracionTicket configuracion)
    {
        context.ConfiguracionesTicket.Update(configuracion);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
