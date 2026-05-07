using ServicioVentas.Application.UseCases.Configuraciones.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IDeleteConfiguracionNegocioHandler
{
    Task Handle(DeleteConfiguracionNegocioCommand command);
}
