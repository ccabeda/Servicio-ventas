namespace ServicioVentas.Domain.Models;

public class VentaDetalle
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public int? ImpuestoId { get; set; }
    public string ImpuestoNombre { get; set; } = string.Empty;
    public decimal ImpuestoPorcentaje { get; set; }
    public decimal ImporteNeto { get; set; }
    public decimal ImporteImpuesto { get; set; }

    public Venta Venta { get; set; } = null!;
    public Producto Producto { get; set; } = null!;
    public Impuesto? Impuesto { get; set; }
}
