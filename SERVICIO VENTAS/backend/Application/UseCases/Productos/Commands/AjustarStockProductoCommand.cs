using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class AjustarStockProductoCommand
{
    public int ProductoId { get; set; }
    public int UsuarioId { get; set; }
    public AjustarStockProductoDto Movimiento { get; set; } = null!;
}
