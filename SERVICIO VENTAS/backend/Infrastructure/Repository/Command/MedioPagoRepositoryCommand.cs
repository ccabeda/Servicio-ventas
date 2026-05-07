using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class MedioPagoRepositoryCommand(ServicioVentasDbContext context) : IMedioPagoRepositoryCommand
{
    public async Task AddAsync(MedioPago medioPago) => await context.MediosPago.AddAsync(medioPago);
    public Task UpdateAsync(MedioPago medioPago) { context.MediosPago.Update(medioPago); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
