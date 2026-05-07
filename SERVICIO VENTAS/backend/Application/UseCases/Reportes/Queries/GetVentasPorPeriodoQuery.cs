namespace ServicioVentas.Application.UseCases.Reportes.Queries;

public class GetVentasPorPeriodoQuery
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int? CajaId { get; set; }
    public int? UsuarioId { get; set; }
    public int? MedioPagoId { get; set; }
}
