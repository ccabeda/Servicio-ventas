using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface ICategoriaProductoRepositoryCommand
{
    Task AddAsync(CategoriaProducto categoria);
    Task UpdateAsync(CategoriaProducto categoria);
    Task DeleteAsync(CategoriaProducto categoria);
    Task SaveChangesAsync();
}
