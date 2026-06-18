using ServicioVentas.Application.DTOs.Auth;

namespace ServicioVentas.Application.UseCases.Auth.Commands;

public class CambiarPasswordCommand
{
    public CambiarPasswordDto Request { get; set; } = new();
}
