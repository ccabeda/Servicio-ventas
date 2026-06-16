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
public class CategoriasProductoController(
    ICreateCategoriaProductoHandler createHandler,
    IUpdateCategoriaProductoHandler updateHandler,
    IDeleteCategoriaProductoHandler deleteHandler,
    IGetCategoriasProductoHandler getAllHandler,
    IGetCategoriaProductoByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoriaProductoDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetCategoriasProductoQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaProductoDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetCategoriaProductoByIdQuery { Id = id }));
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpPost]
    public async Task<ActionResult<CategoriaProductoDto>> Create([FromBody] CreateCategoriaProductoDto request)
    {
        var categoria = await createHandler.Handle(new CreateCategoriaProductoCommand { Categoria = request });
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoriaProductoDto>> Update(int id, [FromBody] UpdateCategoriaProductoDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateCategoriaProductoCommand { Id = id, Categoria = request }));
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteCategoriaProductoCommand { Id = id });
        return NoContent();
    }
}
