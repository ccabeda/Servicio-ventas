using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class CreateCategoriaProductoCommand
{
    public CreateCategoriaProductoDto Categoria { get; set; } = null!;
}
