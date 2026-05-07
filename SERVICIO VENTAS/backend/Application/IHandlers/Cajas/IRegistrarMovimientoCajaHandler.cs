using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.UseCases.Cajas.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IRegistrarMovimientoCajaHandler
{
    Task<MovimientoCajaDto> Handle(RegistrarMovimientoCajaCommand command);
}
