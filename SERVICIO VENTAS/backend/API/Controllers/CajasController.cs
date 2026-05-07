using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    IGetMovimientosCajaHandler getMovimientosCajaHandler) : ControllerBase
{
    [HttpGet("actual")]
    public async Task<ActionResult<CajaDto?>> GetCajaActual()
    {
        var caja = await getCajaActualHandler.Handle(new GetCajaActualQuery());
        return Ok(caja);
    }

    [HttpGet("{cajaId:int}/movimientos")]
    public async Task<ActionResult<List<MovimientoCajaDto>>> GetMovimientos(int cajaId)
    {
        var movimientos = await getMovimientosCajaHandler.Handle(new GetMovimientosCajaQuery { CajaId = cajaId });
        return Ok(movimientos);
    }

    [HttpPost("abrir")]
    public async Task<ActionResult<CajaDto>> Abrir([FromBody] AbrirCajaDto request)
    {
        var caja = await abrirCajaHandler.Handle(new AbrirCajaCommand { Caja = request });
        return Ok(caja);
    }

    [HttpPost("{cajaId:int}/movimientos")]
    public async Task<ActionResult<MovimientoCajaDto>> RegistrarMovimiento(int cajaId, [FromBody] RegistrarMovimientoCajaDto request)
    {
        var movimiento = await registrarMovimientoCajaHandler.Handle(new RegistrarMovimientoCajaCommand
        {
            CajaId = cajaId,
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
            Caja = request
        });

        return Ok(caja);
    }
}
