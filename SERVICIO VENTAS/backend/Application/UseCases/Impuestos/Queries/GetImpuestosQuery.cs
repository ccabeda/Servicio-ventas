namespace ServicioVentas.Application.UseCases.Impuestos.Queries;

public class GetImpuestosQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public string Estado { get; set; } = "activos";
}
