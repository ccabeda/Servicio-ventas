using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class UpdateProductoCommand
{
    public int Id { get; set; }
    public UpdateProductoDto Producto { get; set; } = null!;
}
