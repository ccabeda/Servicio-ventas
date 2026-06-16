using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IMovimientoStockRepositoryCommand
{
    Task AddAsync(MovimientoStock movimiento);
}
