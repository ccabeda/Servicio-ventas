using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class CreateMarcaProductoCommand
{
    public CreateMarcaProductoDto Marca { get; set; } = null!;
}
