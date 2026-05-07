using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Domain.Models;

public class Venta
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public decimal Subtotal { get; set; }
    public decimal Descuento { get; set; }
    public decimal Recargo { get; set; }
    public decimal Total { get; set; }
    public EstadoVenta Estado { get; set; } = EstadoVenta.Confirmada;
    public string? Observaciones { get; set; }

    public int MedioPagoId { get; set; }
    public int CajaId { get; set; }
    public int UsuarioId { get; set; }
    public int? ClienteId { get; set; }

    public MedioPago MedioPago { get; set; } = null!;
    public Caja Caja { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
    public Cliente? Cliente { get; set; }
    public ICollection<VentaDetalle> Detalles { get; set; } = new List<VentaDetalle>();
}
