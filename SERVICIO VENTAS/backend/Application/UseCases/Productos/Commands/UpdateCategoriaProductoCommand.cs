using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class UpdateCategoriaProductoCommand
{
    public int Id { get; set; }
    public UpdateCategoriaProductoDto Categoria { get; set; } = null!;
}
