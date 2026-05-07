using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.UseCases.Auth.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ILoginHandler
{
    Task<LoginResponseDto> Handle(LoginCommand command);
}
