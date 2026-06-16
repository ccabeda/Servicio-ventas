namespace ServicioVentas.Application.UseCases.Productos.Queries;

public class GetProductosQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public int? CategoriaId { get; set; }
    public int? MarcaId { get; set; }
    public string Estado { get; set; } = "activos";
}
