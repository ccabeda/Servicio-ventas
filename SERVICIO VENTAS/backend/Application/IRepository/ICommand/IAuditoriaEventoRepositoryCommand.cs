using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IAuditoriaEventoRepositoryCommand
{
    Task AddAsync(AuditoriaEvento evento);
}
