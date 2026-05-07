using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetCajaActualHandler
{
    Task<CajaDto?> Handle(GetCajaActualQuery query);
}
