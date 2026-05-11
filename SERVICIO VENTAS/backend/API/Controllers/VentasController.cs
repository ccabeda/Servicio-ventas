using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
    public async Task<ActionResult<List<VentaDto>>> GetAll()
    {
        var ventas = await getAllHandler.Handle(new GetVentasQuery());
        return Ok(EsAdmin() ? ventas : ventas.Where(v => v.UsuarioId == GetCurrentUserId()).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VentaDto>> GetById(int id)
    {
        var venta = await getByIdHandler.Handle(new GetVentaByIdQuery { Id = id });
        return !EsAdmin() && venta.UsuarioId != GetCurrentUserId() ? Forbid() : Ok(venta);
    }

    [HttpPost]
    public async Task<ActionResult<VentaDto>> Create([FromBody] CreateVentaDto request)
    {
        request.UsuarioId = GetCurrentUserId();
        var venta = await createHandler.Handle(new CreateVentaCommand { Venta = request });
        return CreatedAtAction(nameof(GetById), new { id = venta.Id }, venta);
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
