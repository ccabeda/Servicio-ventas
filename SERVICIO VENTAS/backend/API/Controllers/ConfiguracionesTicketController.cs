using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConfiguracionesTicketController(
    IGetConfiguracionTicketPrincipalHandler getPrincipalHandler,
    IUpdateConfiguracionTicketHandler updateHandler) : ControllerBase
{
    [HttpGet("principal")]
    public async Task<ActionResult<ConfiguracionTicketDto>> GetPrincipal()
    {
        return Ok(await getPrincipalHandler.Handle(new GetConfiguracionTicketPrincipalQuery()));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ConfiguracionTicketDto>> Update(int id, [FromBody] UpdateConfiguracionTicketDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateConfiguracionTicketCommand { Id = id, Configuracion = request }));
    }
}
