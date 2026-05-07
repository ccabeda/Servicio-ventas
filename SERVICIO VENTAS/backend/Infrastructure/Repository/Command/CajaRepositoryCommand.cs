using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class CajaRepositoryCommand(ServicioVentasDbContext context) : ICajaRepositoryCommand
{
    public async Task AddCajaAsync(Caja caja)
    {
        await context.Cajas.AddAsync(caja);
    }

    public async Task AddMovimientoAsync(MovimientoCaja movimiento)
    {
        await context.MovimientosCaja.AddAsync(movimiento);
    }

    public Task UpdateCajaAsync(Caja caja)
    {
        context.Cajas.Update(caja);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}
