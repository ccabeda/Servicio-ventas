using ServicioVentas.Application.DTOs.Usuarios;

namespace ServicioVentas.Application.UseCases.Usuarios.Commands;

public class CreateUsuarioCommand
{
    public CreateUsuarioDto Usuario { get; set; } = null!;
}
