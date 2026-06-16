using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IConfiguracionTicketRepositoryQuery
{
    Task<ConfiguracionTicket?> GetPrincipalAsync();
    Task<ConfiguracionTicket?> GetByIdAsync(int id);
}
