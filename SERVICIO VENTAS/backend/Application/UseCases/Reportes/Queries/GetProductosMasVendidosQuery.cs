namespace ServicioVentas.Application.UseCases.Reportes.Queries;

public class GetProductosMasVendidosQuery
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int? CajaId { get; set; }
    public int? UsuarioId { get; set; }
    public int? MedioPagoId { get; set; }
    public int? ClienteId { get; set; }
    public decimal? TotalMinimo { get; set; }
    public decimal? TotalMaximo { get; set; }
    public int Top { get; set; } = 10;
}
