using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.UseCases.MediosPago.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IUpdateMedioPagoHandler
{
    Task<MedioPagoDto> Handle(UpdateMedioPagoCommand command);
}
