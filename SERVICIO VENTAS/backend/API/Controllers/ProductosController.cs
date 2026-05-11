using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductosController(
    ICreateProductoHandler createProductoHandler,
    IUpdateProductoHandler updateProductoHandler,
    IDeleteProductoHandler deleteProductoHandler,
    IGetProductosHandler getProductosHandler,
    IGetProductoByIdHandler getProductoByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductoDto>>> GetAll()
    {
        var productos = await getProductosHandler.Handle(new GetProductosQuery());
        return Ok(productos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoDto>> GetById(int id)
    {
        var producto = await getProductoByIdHandler.Handle(new GetProductoByIdQuery { Id = id });
        return Ok(producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductoDto>> Create([FromBody] CreateProductoDto request)
    {
        var producto = await createProductoHandler.Handle(new CreateProductoCommand { Producto = request });
        return CreatedAtAction(nameof(GetById), new { id = producto.Id }, producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductoDto>> Update(int id, [FromBody] UpdateProductoDto request)
    {
        var producto = await updateProductoHandler.Handle(new UpdateProductoCommand
        {
            Id = id,
            Producto = request
        });

        return Ok(producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteProductoHandler.Handle(new DeleteProductoCommand { Id = id });
        return NoContent();
    }
}
