using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Clientes.Commands;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientesController(
    ICreateClienteHandler createHandler,
    IUpdateClienteHandler updateHandler,
    IDeleteClienteHandler deleteHandler,
    IGetClientesHandler getAllHandler,
    IGetClienteByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ClienteDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetClientesQuery()));

    [HttpGet("paginado")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string estado = "activos")
    {
        return Ok(await getAllHandler.HandlePaged(new GetClientesQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            Estado = estado
        }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetClienteByIdQuery { Id = id }));
    }

    [Authorize(Policy = PermisosSistema.ClientesGestionar)]
    [HttpPost]
    public async Task<ActionResult<ClienteDto>> Create([FromBody] CreateClienteDto request)
    {
        var cliente = await createHandler.Handle(new CreateClienteCommand { Cliente = request });
        return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
    }

    [Authorize(Policy = PermisosSistema.ClientesGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClienteDto>> Update(int id, [FromBody] UpdateClienteDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateClienteCommand { Id = id, Cliente = request }));
    }

    [Authorize(Policy = PermisosSistema.ClientesGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteClienteCommand { Id = id });
        return NoContent();
    }
}
