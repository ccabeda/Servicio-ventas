using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetConfiguracionNegocioByIdHandler
{
    Task<ConfiguracionNegocioDto> Handle(GetConfiguracionNegocioByIdQuery query);
}
