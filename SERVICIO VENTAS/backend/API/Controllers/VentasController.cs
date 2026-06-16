using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Services;
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
    IGetVentaByIdHandler getByIdHandler,
    ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<VentaDto>>> GetAll()
    {
        return Ok(await getAllHandler.Handle(new GetVentasQuery
        {
            UsuarioId = currentUser.IsAdmin ? null : currentUser.UserId
        }));
    }

    [HttpGet("paginado")]
    public async Task<IActionResult> GetPaged([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 20)
    {
        return Ok(await getAllHandler.HandlePaged(new GetVentasQuery
        {
            UsuarioId = currentUser.IsAdmin ? null : currentUser.UserId,
            PageIndex = pageIndex,
            PageSize = pageSize
        }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VentaDto>> GetById(int id)
    {
        var venta = await getByIdHandler.Handle(new GetVentaByIdQuery { Id = id });
        return !currentUser.IsAdmin && venta.UsuarioId != currentUser.UserId ? Forbid() : Ok(venta);
    }

    [HttpPost]
    public async Task<ActionResult<VentaDto>> Create([FromBody] CreateVentaDto request)
    {
        var venta = await createHandler.Handle(new CreateVentaCommand
        {
            UsuarioId = currentUser.UserId,
            Venta = request
        });
        return CreatedAtAction(nameof(GetById), new { id = venta.Id }, venta);
    }
}
