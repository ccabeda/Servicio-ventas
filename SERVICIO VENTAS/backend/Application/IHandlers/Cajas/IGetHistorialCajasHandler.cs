using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetHistorialCajasHandler
{
    Task<List<CajaDto>> Handle(GetHistorialCajasQuery query);
}
