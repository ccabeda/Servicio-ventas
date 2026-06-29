using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.ISecurity;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Auth.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Auth.Handlers;

public class LoginHandler(
    IUsuarioRepositoryQuery usuarioRepositoryQuery,
    IJwtTokenGenerator jwtTokenGenerator,
    ILogger<LoginHandler> logger) : ILoginHandler
{
    private static readonly Action<ILogger, string, Exception?> LoginFallidoUsuarioInexistenteOInactivo =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            new EventId(1001, nameof(LoginFallidoUsuarioInexistenteOInactivo)),
            "Intento de login fallido para usuario {NombreUsuario}. Usuario inexistente o inactivo.");

    private static readonly Action<ILogger, int, Exception?> LoginFallidoPasswordInvalida =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            new EventId(1002, nameof(LoginFallidoPasswordInvalida)),
            "Intento de login fallido para usuario {UsuarioId}. Contraseña inválida.");

    private static readonly Action<ILogger, int, string, Exception?> LoginCorrecto =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(1003, nameof(LoginCorrecto)),
            "Login correcto para usuario {UsuarioId} con rol {Rol}.");

    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    public async Task<LoginResponseDto> Handle(LoginCommand command)
    {
        var request = command.Login;

        var usuario = await usuarioRepositoryQuery.GetByNombreUsuarioAsync(request.NombreUsuario.Trim());
        if (usuario is null || !usuario.Activo)
        {
            LoginFallidoUsuarioInexistenteOInactivo(logger, request.NombreUsuario.Trim(), null);
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        var verification = _passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, request.Password);
        if (verification is PasswordVerificationResult.Failed)
        {
            LoginFallidoPasswordInvalida(logger, usuario.Id, null);
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        var rol = usuario.Rol.ToString();
        var permisos = PermisosSistema.ParaRol(usuario.Rol);
        var token = jwtTokenGenerator.GenerateToken(usuario.Id, usuario.NombreUsuario, rol, permisos);
        LoginCorrecto(logger, usuario.Id, rol, null);

        return new LoginResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            NombreUsuario = usuario.NombreUsuario,
            Rol = rol,
            DebeCambiarPassword = usuario.DebeCambiarPassword,
            Permisos = permisos.ToList()
        };
    }
}
