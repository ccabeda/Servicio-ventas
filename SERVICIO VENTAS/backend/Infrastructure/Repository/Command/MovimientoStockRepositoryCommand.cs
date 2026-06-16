using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class MovimientoStockRepositoryCommand(ServicioVentasDbContext context) : IMovimientoStockRepositoryCommand
{
    public async Task AddAsync(MovimientoStock movimiento)
    {
        await context.MovimientosStock.AddAsync(movimiento);
    }
}
