using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IClienteRepositoryQuery
{
    Task<List<Cliente>> GetAllAsync();
    Task<(List<Cliente> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado);
    Task<Cliente?> GetByIdAsync(int id);
}
