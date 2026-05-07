using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
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

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetClienteByIdQuery { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> Create([FromBody] CreateClienteDto request)
    {
        var cliente = await createHandler.Handle(new CreateClienteCommand { Cliente = request });
        return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClienteDto>> Update(int id, [FromBody] UpdateClienteDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateClienteCommand { Id = id, Cliente = request }));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteClienteCommand { Id = id });
        return NoContent();
    }
}
