using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Domain.Models;

public class MovimientoStock
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public TipoMovimientoStock Tipo { get; set; }
    public decimal Cantidad { get; set; }
    public decimal StockAnterior { get; set; }
    public decimal StockNuevo { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public int UsuarioId { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public Producto Producto { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
}
