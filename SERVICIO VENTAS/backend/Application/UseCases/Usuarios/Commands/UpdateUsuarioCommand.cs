using ServicioVentas.Application.DTOs.Usuarios;

namespace ServicioVentas.Application.UseCases.Usuarios.Commands;

public class UpdateUsuarioCommand
{
    public int Id { get; set; }
    public UpdateUsuarioDto Usuario { get; set; } = null!;
}
