using ServicioVentas.Application.UseCases.MediosPago.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IDeleteMedioPagoHandler
{
    Task Handle(DeleteMedioPagoCommand command);
}
