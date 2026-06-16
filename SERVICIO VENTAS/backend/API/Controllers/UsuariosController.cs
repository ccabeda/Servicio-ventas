using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Usuarios.Commands;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = PermisosSistema.UsuariosGestionar)]
public class UsuariosController(
    ICreateUsuarioHandler createHandler,
    IUpdateUsuarioHandler updateHandler,
    IDeleteUsuarioHandler deleteHandler,
    IGetUsuariosHandler getAllHandler,
    IGetUsuarioByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UsuarioDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetUsuariosQuery()));

    [HttpGet("paginado")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string estado = "activos")
    {
        return Ok(await getAllHandler.HandlePaged(new GetUsuariosQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            Estado = estado
        }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetUsuarioByIdQuery { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioDto>> Create([FromBody] CreateUsuarioDto request)
    {
        var usuario = await createHandler.Handle(new CreateUsuarioCommand { Usuario = request });
        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UsuarioDto>> Update(int id, [FromBody] UpdateUsuarioDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateUsuarioCommand { Id = id, Usuario = request }));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteUsuarioCommand { Id = id });
        return NoContent();
    }
}
