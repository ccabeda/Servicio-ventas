using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ProductoRepositoryCommand(ServicioVentasDbContext context) : IProductoRepositoryCommand
{
    public async Task AddAsync(Producto producto)
    {
        await context.Productos.AddAsync(producto);
    }

    public Task UpdateAsync(Producto producto)
    {
        context.Productos.Update(producto);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}
