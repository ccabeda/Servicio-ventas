namespace ServicioVentas.Application.DTOs.Reportes;

public class ResumenVentasDto
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int CantidadVentas { get; set; }
    public int ProductosDistintosVendidos { get; set; }
    public decimal UnidadesVendidas { get; set; }
    public decimal TotalVendido { get; set; }
    public decimal TicketPromedio { get; set; }
    public decimal GananciaEstimada { get; set; }
}

public class VentaReporteDto
{
    public int VentaId { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Descuento { get; set; }
    public decimal Recargo { get; set; }
    public int CajaId { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    public int MedioPagoId { get; set; }
    public string MedioPagoNombre { get; set; } = string.Empty;
    public int? ClienteId { get; set; }
    public string? ClienteNombre { get; set; }
    public int CantidadItems { get; set; }
    public decimal UnidadesVendidas { get; set; }
}

public class ProductoMasVendidoDto
{
    public int ProductoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal CantidadVendida { get; set; }
    public decimal ImporteVendido { get; set; }
    public decimal GananciaEstimada { get; set; }
}
