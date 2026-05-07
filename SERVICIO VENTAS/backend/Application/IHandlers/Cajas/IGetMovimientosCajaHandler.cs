using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetMovimientosCajaHandler
{
    Task<List<MovimientoCajaDto>> Handle(GetMovimientosCajaQuery query);
}
