using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Ventas.Commands;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VentasController(
    ICreateVentaHandler createHandler,
    IGetVentasHandler getAllHandler,
    IGetVentaByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<VentaDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetVentasQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VentaDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetVentaByIdQuery { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<VentaDto>> Create([FromBody] CreateVentaDto request)
    {
        var venta = await createHandler.Handle(new CreateVentaCommand { Venta = request });
        return CreatedAtAction(nameof(GetById), new { id = venta.Id }, venta);
    }
}
