using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetConfiguracionesNegocioHandler
{
    Task<List<ConfiguracionNegocioDto>> Handle(GetConfiguracionesNegocioQuery query);
}
