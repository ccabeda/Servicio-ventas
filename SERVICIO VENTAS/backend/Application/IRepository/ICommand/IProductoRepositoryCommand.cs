using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IProductoRepositoryCommand
{
    Task AddAsync(Producto producto);
    Task UpdateAsync(Producto producto);
    Task SaveChangesAsync();
}
