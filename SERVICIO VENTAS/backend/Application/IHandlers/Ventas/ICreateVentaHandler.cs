using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.UseCases.Ventas.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateVentaHandler
{
    Task<VentaDto> Handle(CreateVentaCommand command);
}
