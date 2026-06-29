using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IAjustarStockProductoHandler
{
    Task<ProductoDto> Handle(AjustarStockProductoCommand command);
}

public interface IGetMovimientosStockProductoHandler
{
    Task<List<MovimientoStockDto>> Handle(GetMovimientosStockProductoQuery query);
    Task<PagedResultDto<MovimientoStockDto>> HandlePaged(GetMovimientosStockProductoQuery query);
}
