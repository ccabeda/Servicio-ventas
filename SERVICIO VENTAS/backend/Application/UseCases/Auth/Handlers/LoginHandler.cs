using Microsoft.AspNetCore.Identity;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.ISecurity;
using ServicioVentas.Application.UseCases.Auth.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Auth.Handlers;

public class LoginHandler(
    IUsuarioRepositoryQuery usuarioRepositoryQuery,
    IJwtTokenGenerator jwtTokenGenerator) : ILoginHandler
{
    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    public async Task<LoginResponseDto> Handle(LoginCommand command)
    {
        var request = command.Login;

        var usuario = await usuarioRepositoryQuery.GetByNombreUsuarioAsync(request.NombreUsuario.Trim());
        if (usuario is null || !usuario.Activo)
        {
            throw new UnauthorizedAccessException("Credenciales invalidas.");
        }

        var verification = _passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, request.Password);
        if (verification is PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Credenciales invalidas.");
        }

        var rol = usuario.Rol.ToString();
        var token = jwtTokenGenerator.GenerateToken(usuario.Id, usuario.NombreUsuario, rol);

        return new LoginResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            NombreUsuario = usuario.NombreUsuario,
            Rol = rol
        };
    }
}
