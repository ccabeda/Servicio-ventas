using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.DTOs.Productos;

public class MovimientoStockDto
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public TipoMovimientoStock Tipo { get; set; }
    public decimal Cantidad { get; set; }
    public decimal StockAnterior { get; set; }
    public decimal StockNuevo { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
}

public class AjustarStockProductoDto
{
    public TipoMovimientoStock Tipo { get; set; }
    public decimal Cantidad { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
}
