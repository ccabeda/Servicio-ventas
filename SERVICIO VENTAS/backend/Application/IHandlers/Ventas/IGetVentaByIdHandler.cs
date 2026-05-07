using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetVentaByIdHandler
{
    Task<VentaDto> Handle(GetVentaByIdQuery query);
}
