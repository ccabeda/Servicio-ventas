using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class CreateProductoCommand
{
    public CreateProductoDto Producto { get; set; } = null!;
}
