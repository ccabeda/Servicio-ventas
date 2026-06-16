using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.UseCases.Productos.Commands;

public class UpdateMarcaProductoCommand
{
    public int Id { get; set; }
    public UpdateMarcaProductoDto Marca { get; set; } = null!;
}
