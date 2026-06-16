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
    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    public async Task<LoginResponseDto> Handle(LoginCommand command)
    {
        var request = command.Login;

        var usuario = await usuarioRepositoryQuery.GetByNombreUsuarioAsync(request.NombreUsuario.Trim());
        if (usuario is null || !usuario.Activo)
        {
            logger.LogWarning("Intento de login fallido para usuario {NombreUsuario}. Usuario inexistente o inactivo.", request.NombreUsuario.Trim());
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        var verification = _passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, request.Password);
        if (verification is PasswordVerificationResult.Failed)
        {
            logger.LogWarning("Intento de login fallido para usuario {UsuarioId}. Contraseña inválida.", usuario.Id);
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        var rol = usuario.Rol.ToString();
        var permisos = PermisosSistema.ParaRol(usuario.Rol);
        var token = jwtTokenGenerator.GenerateToken(usuario.Id, usuario.NombreUsuario, rol, permisos);
        logger.LogInformation("Login correcto para usuario {UsuarioId} con rol {Rol}.", usuario.Id, rol);

        return new LoginResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            NombreUsuario = usuario.NombreUsuario,
            Rol = rol,
            Permisos = permisos.ToList()
        };
    }
}
