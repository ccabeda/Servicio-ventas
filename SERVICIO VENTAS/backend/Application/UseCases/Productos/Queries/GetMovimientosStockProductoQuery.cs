namespace ServicioVentas.Application.UseCases.Productos.Queries;

public class GetMovimientosStockProductoQuery
{
    public int ProductoId { get; set; }
    public int Take { get; set; } = 10;
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
}
