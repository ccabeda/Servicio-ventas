using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IMarcaProductoRepositoryCommand
{
    Task AddAsync(MarcaProducto marca);
    Task UpdateAsync(MarcaProducto marca);
    Task SaveChangesAsync();
}
