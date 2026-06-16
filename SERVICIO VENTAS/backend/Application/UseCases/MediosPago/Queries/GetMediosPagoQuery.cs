namespace ServicioVentas.Application.UseCases.MediosPago.Queries;

public class GetMediosPagoQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public string Estado { get; set; } = "activos";
}
