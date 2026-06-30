using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IImpuestoRepositoryCommand
{
    Task AddAsync(Impuesto impuesto);
    Task UpdateAsync(Impuesto impuesto);
    Task SaveChangesAsync();
}
