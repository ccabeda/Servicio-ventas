using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IClienteRepositoryCommand
{
    Task AddAsync(Cliente cliente);
    Task UpdateAsync(Cliente cliente);
    Task SaveChangesAsync();
}
