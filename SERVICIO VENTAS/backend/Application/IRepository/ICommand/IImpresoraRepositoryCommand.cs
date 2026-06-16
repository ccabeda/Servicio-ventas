using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IImpresoraRepositoryCommand
{
    Task AddAsync(Impresora impresora);
    Task UpdateAsync(Impresora impresora);
    Task SaveChangesAsync();
}
