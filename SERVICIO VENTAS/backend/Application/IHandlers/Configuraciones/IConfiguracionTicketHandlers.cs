using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetConfiguracionTicketPrincipalHandler
{
    Task<ConfiguracionTicketDto> Handle(GetConfiguracionTicketPrincipalQuery query);
}

public interface IUpdateConfiguracionTicketHandler
{
    Task<ConfiguracionTicketDto> Handle(UpdateConfiguracionTicketCommand command);
}
