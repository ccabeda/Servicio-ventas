using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class VentaRepositoryCommand(ServicioVentasDbContext context) : IVentaRepositoryCommand
{
    public async Task AddAsync(Venta venta) => await context.Ventas.AddAsync(venta);
    public async Task AddMovimientoAsync(MovimientoCaja movimientoCaja) => await context.MovimientosCaja.AddAsync(movimientoCaja);
}
