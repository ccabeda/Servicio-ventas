using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetMediosPagoHandler
{
    Task<List<MedioPagoDto>> Handle(GetMediosPagoQuery query);
}
