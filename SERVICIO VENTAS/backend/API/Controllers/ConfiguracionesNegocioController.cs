using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Extensions;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConfiguracionesNegocioController(
    ICreateConfiguracionNegocioHandler createHandler,
    IUpdateConfiguracionNegocioHandler updateHandler,
    IDeleteConfiguracionNegocioHandler deleteHandler,
    IGetConfiguracionesNegocioHandler getAllHandler,
    IGetConfiguracionNegocioByIdHandler getByIdHandler,
    IUploadConfiguracionNegocioLogoHandler uploadLogoHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ConfiguracionNegocioDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetConfiguracionesNegocioQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ConfiguracionNegocioDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetConfiguracionNegocioByIdQuery { Id = id }));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPost]
    public async Task<ActionResult<ConfiguracionNegocioDto>> Create([FromBody] CreateConfiguracionNegocioDto request)
    {
        var configuracion = await createHandler.Handle(new CreateConfiguracionNegocioCommand { Configuracion = request });
        return CreatedAtAction(nameof(GetById), new { id = configuracion.Id }, configuracion);
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ConfiguracionNegocioDto>> Update(int id, [FromBody] UpdateConfiguracionNegocioDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateConfiguracionNegocioCommand { Id = id, Configuracion = request }));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPost("{id:int}/logo")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<ActionResult<ConfiguracionNegocioDto>> UploadLogo(int id, [FromForm] IFormFile? archivo)
    {
        return Ok(await uploadLogoHandler.Handle(new UploadConfiguracionNegocioLogoCommand
        {
            Id = id,
            Archivo = archivo.ToApplicationFile(),
            CancellationToken = HttpContext.RequestAborted
        }));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteConfiguracionNegocioCommand { Id = id });
        return NoContent();
    }
}
