using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateConfiguracionNegocioHandler
{
    Task<ConfiguracionNegocioDto> Handle(CreateConfiguracionNegocioCommand command);
}
