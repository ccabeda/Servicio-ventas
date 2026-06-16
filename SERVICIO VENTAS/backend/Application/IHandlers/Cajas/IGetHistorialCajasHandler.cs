using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetHistorialCajasHandler
{
    Task<List<CajaDto>> Handle(GetHistorialCajasQuery query);
    Task<PagedResultDto<CajaDto>> HandlePaged(GetHistorialCajasQuery query);
}
