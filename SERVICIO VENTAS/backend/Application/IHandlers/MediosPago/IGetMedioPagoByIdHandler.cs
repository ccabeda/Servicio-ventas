using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetMedioPagoByIdHandler
{
    Task<MedioPagoDto> Handle(GetMedioPagoByIdQuery query);
}
