namespace ServicioVentas.Application.UseCases.Reportes.Queries;

public class GetResumenVentasQuery
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int? UsuarioId { get; set; }
}
