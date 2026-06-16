using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Auditoria.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = PermisosSistema.AuditoriaVer)]
public class AuditoriaController(
    IGetAuditoriaEventosHandler getEventosHandler,
    IGetAuditoriaEventoByIdHandler getEventoByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<AuditoriaEventoDto>>> GetPaged(
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? fechaDesde = null,
        [FromQuery] DateTime? fechaHasta = null,
        [FromQuery] int? usuarioId = null,
        [FromQuery] string? modulo = null,
        [FromQuery] string? accion = null,
        [FromQuery] string? search = null)
    {
        return Ok(await getEventosHandler.HandlePaged(new GetAuditoriaEventosQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta,
            UsuarioId = usuarioId,
            Modulo = modulo,
            Accion = accion,
            Search = search
        }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AuditoriaEventoDto>> GetById(int id)
    {
        return Ok(await getEventoByIdHandler.Handle(new GetAuditoriaEventoByIdQuery { Id = id }));
    }
}
