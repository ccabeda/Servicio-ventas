using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Services;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CajasController(
    IAbrirCajaHandler abrirCajaHandler,
    ICerrarCajaHandler cerrarCajaHandler,
    IRegistrarMovimientoCajaHandler registrarMovimientoCajaHandler,
    IGetCajaActualHandler getCajaActualHandler,
    IGetHistorialCajasHandler getHistorialCajasHandler,
    IGetMovimientosCajaHandler getMovimientosCajaHandler,
    ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CajaDto>>> GetHistorial()
    {
        var cajas = await getHistorialCajasHandler.Handle(new GetHistorialCajasQuery
        {
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin
        });

        return Ok(cajas);
    }

    [HttpGet("paginado")]
    public async Task<IActionResult> GetHistorialPaged([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 20)
    {
        return Ok(await getHistorialCajasHandler.HandlePaged(new GetHistorialCajasQuery
        {
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin,
            PageIndex = pageIndex,
            PageSize = pageSize
        }));
    }

    [HttpGet("actual")]
    public async Task<ActionResult<CajaDto?>> GetCajaActual()
    {
        var caja = await getCajaActualHandler.Handle(new GetCajaActualQuery());
        return Ok(caja);
    }

    [HttpGet("{cajaId:int}/movimientos")]
    public async Task<ActionResult<List<MovimientoCajaDto>>> GetMovimientos(int cajaId)
    {
        var movimientos = await getMovimientosCajaHandler.Handle(new GetMovimientosCajaQuery
        {
            CajaId = cajaId,
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin
        });
        return Ok(movimientos);
    }

    [HttpGet("{cajaId:int}/movimientos/paginado")]
    public async Task<IActionResult> GetMovimientosPaged(int cajaId, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 20)
    {
        return Ok(await getMovimientosCajaHandler.HandlePaged(new GetMovimientosCajaQuery
        {
            CajaId = cajaId,
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin,
            PageIndex = pageIndex,
            PageSize = pageSize
        }));
    }

    [HttpPost("abrir")]
    public async Task<ActionResult<CajaDto>> Abrir([FromBody] AbrirCajaDto request)
    {
        var caja = await abrirCajaHandler.Handle(new AbrirCajaCommand
        {
            UsuarioId = currentUser.UserId,
            Caja = request
        });
        return Ok(caja);
    }

    [HttpPost("{cajaId:int}/movimientos")]
    public async Task<ActionResult<MovimientoCajaDto>> RegistrarMovimiento(int cajaId, [FromBody] RegistrarMovimientoCajaDto request)
    {
        var movimiento = await registrarMovimientoCajaHandler.Handle(new RegistrarMovimientoCajaCommand
        {
            CajaId = cajaId,
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin,
            Movimiento = request
        });

        return Ok(movimiento);
    }

    [HttpPost("{cajaId:int}/cerrar")]
    public async Task<ActionResult<CajaDto>> Cerrar(int cajaId, [FromBody] CerrarCajaDto request)
    {
        var caja = await cerrarCajaHandler.Handle(new CerrarCajaCommand
        {
            CajaId = cajaId,
            UsuarioId = currentUser.UserId,
            EsAdmin = currentUser.IsAdmin,
            Caja = request
        });

        return Ok(caja);
    }
}
