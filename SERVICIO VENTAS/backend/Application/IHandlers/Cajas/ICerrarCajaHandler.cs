using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.UseCases.Cajas.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICerrarCajaHandler
{
    Task<CajaDto> Handle(CerrarCajaCommand command);
}
