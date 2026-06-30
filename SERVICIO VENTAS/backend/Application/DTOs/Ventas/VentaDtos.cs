using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.DTOs.Ventas;

public class VentaDetalleDto
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public int? ImpuestoId { get; set; }
    public string ImpuestoNombre { get; set; } = string.Empty;
    public decimal ImpuestoPorcentaje { get; set; }
    public decimal ImporteNeto { get; set; }
    public decimal ImporteImpuesto { get; set; }
}

public class VentaDto
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Descuento { get; set; }
    public decimal Recargo { get; set; }
    public decimal Total { get; set; }
    public EstadoVenta Estado { get; set; }
    public string? Observaciones { get; set; }
    public int MedioPagoId { get; set; }
    public int CajaId { get; set; }
    public int UsuarioId { get; set; }
    public int? ClienteId { get; set; }
    public List<VentaDetalleDto> Detalles { get; set; } = [];
}

public class CreateVentaDetalleDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
}

public class CreateVentaDto
{
    public int MedioPagoId { get; set; }
    public int UsuarioId { get; set; }
    public int? ClienteId { get; set; }
    public string? Observaciones { get; set; }
    public decimal Descuento { get; set; }
    public decimal Recargo { get; set; }
    public List<CreateVentaDetalleDto> Detalles { get; set; } = [];
}
