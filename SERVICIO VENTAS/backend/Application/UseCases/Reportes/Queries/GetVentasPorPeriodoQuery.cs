namespace ServicioVentas.Application.UseCases.Reportes.Queries;

public class GetVentasPorPeriodoQuery
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int? CajaId { get; set; }
    public int? UsuarioId { get; set; }
    public int? MedioPagoId { get; set; }
    public int? ClienteId { get; set; }
    public decimal? TotalMinimo { get; set; }
    public decimal? TotalMaximo { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 8;
}
