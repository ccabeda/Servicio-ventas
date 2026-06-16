using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IConfiguracionTicketRepositoryCommand
{
    Task AddAsync(ConfiguracionTicket configuracion);
    Task UpdateAsync(ConfiguracionTicket configuracion);
    Task SaveChangesAsync();
}
