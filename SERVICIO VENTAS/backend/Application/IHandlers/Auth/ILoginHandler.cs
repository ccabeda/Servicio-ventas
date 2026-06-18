using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.UseCases.Auth.Commands;
using ServicioVentas.Application.UseCases.Auth.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ILoginHandler
{
    Task<LoginResponseDto> Handle(LoginCommand command);
}

public interface IGetCurrentUserHandler
{
    Task<CurrentUserDto> Handle(GetCurrentUserQuery query);
}

public interface ICambiarPasswordHandler
{
    Task<CurrentUserDto> Handle(CambiarPasswordCommand command);
}
