using ServicioVentas.Application.DTOs.Auth;

namespace ServicioVentas.Application.UseCases.Auth.Commands;

public class LoginCommand
{
    public LoginDto Login { get; set; } = null!;
}
