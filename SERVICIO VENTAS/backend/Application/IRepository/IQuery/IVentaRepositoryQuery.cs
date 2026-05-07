using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IVentaRepositoryQuery
{
    Task<List<Venta>> GetAllAsync();
    Task<Venta?> GetByIdAsync(int id);
}
