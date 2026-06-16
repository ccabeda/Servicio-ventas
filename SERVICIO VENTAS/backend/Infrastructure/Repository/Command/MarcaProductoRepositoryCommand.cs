using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class MarcaProductoRepositoryCommand(ServicioVentasDbContext context) : IMarcaProductoRepositoryCommand
{
    public async Task AddAsync(MarcaProducto marca) => await context.MarcasProducto.AddAsync(marca);
    public Task UpdateAsync(MarcaProducto marca) { context.MarcasProducto.Update(marca); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
