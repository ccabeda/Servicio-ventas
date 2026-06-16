using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Services;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
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
    IGetProductoByIdHandler getProductoByIdHandler,
    IAjustarStockProductoHandler ajustarStockProductoHandler,
    IGetMovimientosStockProductoHandler getMovimientosStockProductoHandler,
    ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductoDto>>> GetAll()
    {
        var productos = await getProductosHandler.Handle(new GetProductosQuery());
        return Ok(productos);
    }

    [HttpGet("paginado")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] int? categoriaId = null,
        [FromQuery] int? marcaId = null,
        [FromQuery] string estado = "activos")
    {
        var productos = await getProductosHandler.HandlePaged(new GetProductosQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            CategoriaId = categoriaId,
            MarcaId = marcaId,
            Estado = estado
        });

        return Ok(productos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoDto>> GetById(int id)
    {
        var producto = await getProductoByIdHandler.Handle(new GetProductoByIdQuery { Id = id });
        return Ok(producto);
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpPost]
    public async Task<ActionResult<ProductoDto>> Create([FromBody] CreateProductoDto request)
    {
        var producto = await createProductoHandler.Handle(new CreateProductoCommand { Producto = request });
        return CreatedAtAction(nameof(GetById), new { id = producto.Id }, producto);
    }

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
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

    [Authorize(Policy = PermisosSistema.ProductosGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteProductoHandler.Handle(new DeleteProductoCommand { Id = id });
        return NoContent();
    }

    [Authorize(Policy = PermisosSistema.StockAjustar)]
    [HttpPost("{id:int}/stock")]
    public async Task<ActionResult<ProductoDto>> AjustarStock(int id, [FromBody] AjustarStockProductoDto request)
    {
        var producto = await ajustarStockProductoHandler.Handle(new AjustarStockProductoCommand
        {
            ProductoId = id,
            UsuarioId = currentUser.UserId,
            Movimiento = request
        });

        return Ok(producto);
    }

    [Authorize(Policy = PermisosSistema.StockAjustar)]
    [HttpGet("{id:int}/stock/movimientos")]
    public async Task<ActionResult<List<MovimientoStockDto>>> GetMovimientosStock(int id, [FromQuery] int take = 10)
    {
        var movimientos = await getMovimientosStockProductoHandler.Handle(new GetMovimientosStockProductoQuery
        {
            ProductoId = id,
            Take = take
        });

        return Ok(movimientos);
    }

    [Authorize(Policy = PermisosSistema.StockAjustar)]
    [HttpGet("{id:int}/stock/movimientos/paginado")]
    public async Task<IActionResult> GetMovimientosStockPaged(int id, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 20)
    {
        var movimientos = await getMovimientosStockProductoHandler.HandlePaged(new GetMovimientosStockProductoQuery
        {
            ProductoId = id,
            PageIndex = pageIndex,
            PageSize = pageSize
        });

        return Ok(movimientos);
    }
}
