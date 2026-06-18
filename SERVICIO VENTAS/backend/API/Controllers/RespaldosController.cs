using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Extensions;
using ServicioVentas.Application.DTOs.Respaldos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Respaldos.Commands;
using ServicioVentas.Application.UseCases.Respaldos.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
public class RespaldosController(
    IListarRespaldosHandler listarRespaldosHandler,
    IGetRespaldoConfiguracionHandler getConfiguracionHandler,
    IUpdateRespaldoConfiguracionHandler updateConfiguracionHandler,
    IDescargarRespaldoHandler descargarRespaldoHandler,
    ICrearRespaldoHandler crearRespaldoHandler,
    IRestaurarRespaldoHandler restaurarRespaldoHandler) : ControllerBase
{
    [HttpGet("configuracion")]
    public async Task<ActionResult<RespaldoConfiguracionDto>> GetConfiguracion()
    {
        return Ok(await getConfiguracionHandler.Handle(new GetRespaldoConfiguracionQuery()));
    }

    [HttpPut("configuracion")]
    public async Task<ActionResult<RespaldoConfiguracionDto>> UpdateConfiguracion([FromBody] UpdateRespaldoConfiguracionDto request)
    {
        return Ok(await updateConfiguracionHandler.Handle(new UpdateRespaldoConfiguracionCommand { Request = request }));
    }

    [HttpGet("descargar/{nombreArchivo}")]
    public async Task<IActionResult> Descargar(string nombreArchivo)
    {
        var archivo = await descargarRespaldoHandler.Handle(new DescargarRespaldoQuery { NombreArchivo = nombreArchivo });
        return PhysicalFile(archivo.RutaFisica, archivo.ContentType, archivo.NombreArchivo);
    }

    [HttpGet("paginado")]
    public async Task<IActionResult> ListarPaginado([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 4)
    {
        return Ok(await listarRespaldosHandler.HandlePaged(new ListarRespaldosQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize
        }));
    }

    [HttpPost("crear")]
    public async Task<ActionResult<RespaldoDto>> Crear([FromBody] CrearRespaldoDto request)
    {
        return Ok(await crearRespaldoHandler.Handle(new CrearRespaldoCommand { Request = request }));
    }

    [HttpPost("restaurar")]
    [RequestSizeLimit(100 * 1024 * 1024)]
    public async Task<ActionResult<RespaldoRestauradoDto>> Restaurar([FromForm] IFormFile? archivo)
    {
        return Ok(await restaurarRespaldoHandler.Handle(new RestaurarRespaldoCommand
        {
            Archivo = archivo.ToApplicationFile()
        }));
    }
}
