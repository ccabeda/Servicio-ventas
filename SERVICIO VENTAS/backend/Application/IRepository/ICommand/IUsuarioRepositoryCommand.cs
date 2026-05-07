using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IUsuarioRepositoryCommand
{
    Task AddAsync(Usuario usuario);
    Task UpdateAsync(Usuario usuario);
    Task SaveChangesAsync();
}
