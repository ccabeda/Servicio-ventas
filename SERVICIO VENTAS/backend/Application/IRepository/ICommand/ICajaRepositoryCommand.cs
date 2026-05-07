using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface ICajaRepositoryCommand
{
    Task AddCajaAsync(Caja caja);
    Task AddMovimientoAsync(MovimientoCaja movimiento);
    Task UpdateCajaAsync(Caja caja);
    Task SaveChangesAsync();
}
