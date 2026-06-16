using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MarcasProductoController(
    ICreateMarcaProductoHandler createHandler,
    IUpdateMarcaProductoHandler updateHandler,
    IDeleteMarcaProductoHandler deleteHandler,
    IGetMarcasProductoHandler getAllHandler,
    IGetMarcaProductoByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MarcaProductoDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetMarcasProductoQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MarcaProductoDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetMarcaProductoByIdQuery { Id = id }));
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpPost]
    public async Task<ActionResult<MarcaProductoDto>> Create([FromBody] CreateMarcaProductoDto request)
    {
        var marca = await createHandler.Handle(new CreateMarcaProductoCommand { Marca = request });
        return CreatedAtAction(nameof(GetById), new { id = marca.Id }, marca);
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<MarcaProductoDto>> Update(int id, [FromBody] UpdateMarcaProductoDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateMarcaProductoCommand { Id = id, Marca = request }));
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteMarcaProductoCommand { Id = id });
        return NoContent();
    }
}
