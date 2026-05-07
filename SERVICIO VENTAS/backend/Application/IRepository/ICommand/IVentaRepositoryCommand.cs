using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IVentaRepositoryCommand
{
    Task AddAsync(Venta venta);
    Task AddMovimientoAsync(MovimientoCaja movimientoCaja);
}
