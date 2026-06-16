using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetMovimientosCajaHandler
{
    Task<List<MovimientoCajaDto>> Handle(GetMovimientosCajaQuery query);
    Task<PagedResultDto<MovimientoCajaDto>> HandlePaged(GetMovimientosCajaQuery query);
}
