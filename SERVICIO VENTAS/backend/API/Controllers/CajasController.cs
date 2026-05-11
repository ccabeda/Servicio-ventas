using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
    IGetMovimientosCajaHandler getMovimientosCajaHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CajaDto>>> GetHistorial()
    {
        var cajas = await getHistorialCajasHandler.Handle(new GetHistorialCajasQuery
        {
            UsuarioId = GetCurrentUserId(),
            EsAdmin = EsAdmin()
        });

        return Ok(cajas);
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
            UsuarioId = GetCurrentUserId(),
            EsAdmin = EsAdmin()
        });
        return Ok(movimientos);
    }

    [HttpPost("abrir")]
    public async Task<ActionResult<CajaDto>> Abrir([FromBody] AbrirCajaDto request)
    {
        request.UsuarioAperturaId = GetCurrentUserId();
        var caja = await abrirCajaHandler.Handle(new AbrirCajaCommand { Caja = request });
        return Ok(caja);
    }

    [HttpPost("{cajaId:int}/movimientos")]
    public async Task<ActionResult<MovimientoCajaDto>> RegistrarMovimiento(int cajaId, [FromBody] RegistrarMovimientoCajaDto request)
    {
        request.UsuarioId = GetCurrentUserId();
        var movimiento = await registrarMovimientoCajaHandler.Handle(new RegistrarMovimientoCajaCommand
        {
            CajaId = cajaId,
            UsuarioId = GetCurrentUserId(),
            EsAdmin = EsAdmin(),
            Movimiento = request
        });

        return Ok(movimiento);
    }

    [HttpPost("{cajaId:int}/cerrar")]
    public async Task<ActionResult<CajaDto>> Cerrar(int cajaId, [FromBody] CerrarCajaDto request)
    {
        request.UsuarioCierreId = GetCurrentUserId();
        var caja = await cerrarCajaHandler.Handle(new CerrarCajaCommand
        {
            CajaId = cajaId,
            UsuarioId = GetCurrentUserId(),
            EsAdmin = EsAdmin(),
            Caja = request
        });

        return Ok(caja);
    }

    private int GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

        if (!int.TryParse(userIdValue, out var userId))
            throw new UnauthorizedAccessException("Token invalido.");

        return userId;
    }

    private bool EsAdmin() => User.IsInRole("Admin");
}
