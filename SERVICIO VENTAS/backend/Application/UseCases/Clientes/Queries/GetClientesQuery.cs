namespace ServicioVentas.Application.UseCases.Clientes.Queries;

public class GetClientesQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public string Estado { get; set; } = "activos";
}
