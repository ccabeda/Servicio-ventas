using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IMedioPagoRepositoryCommand
{
    Task AddAsync(MedioPago medioPago);
    Task UpdateAsync(MedioPago medioPago);
    Task SaveChangesAsync();
}
