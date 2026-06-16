using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IAuditoriaEventoRepositoryQuery
{
    Task<(List<AuditoriaEvento> Items, int TotalItems)> GetPagedAsync(
        int pageIndex,
        int pageSize,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        int? usuarioId,
        string? modulo,
        string? accion,
        string? search);

    Task<AuditoriaEvento?> GetByIdAsync(int id);
}
