using Microsoft.AspNetCore.Identity;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Auth.Commands;
using ServicioVentas.Application.UseCases.Auth.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Auth.Handlers;

public class GetCurrentUserHandler(
    ICurrentUserContext currentUser,
    IUsuarioRepositoryQuery usuarioQuery) : IGetCurrentUserHandler
{
    public async Task<CurrentUserDto> Handle(GetCurrentUserQuery query)
    {
        var usuario = await usuarioQuery.GetByIdAsync(currentUser.UserId);

        return new CurrentUserDto
        {
            UsuarioId = currentUser.UserId,
            NombreUsuario = currentUser.UserName,
            Rol = currentUser.Role,
            DebeCambiarPassword = usuario?.DebeCambiarPassword ?? false,
            Permisos = currentUser.Permissions.ToList()
        };
    }
}

public class CambiarPasswordHandler(
    ICurrentUserContext currentUser,
    IUsuarioRepositoryQuery usuarioQuery,
    IUsuarioRepositoryCommand usuarioCommand) : ICambiarPasswordHandler
{
    private readonly PasswordHasher<Usuario> passwordHasher = new();

    public async Task<CurrentUserDto> Handle(CambiarPasswordCommand command)
    {
        if (string.IsNullOrWhiteSpace(command.Request.NuevaPassword))
        {
            throw new InvalidOperationException("La nueva contraseña es obligatoria.");
        }

        var usuario = await usuarioQuery.GetByIdAsync(currentUser.UserId)
            ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

        usuario.PasswordHash = passwordHasher.HashPassword(usuario, command.Request.NuevaPassword);
        usuario.DebeCambiarPassword = false;

        await usuarioCommand.UpdateAsync(usuario);
        await usuarioCommand.SaveChangesAsync();

        return new CurrentUserDto
        {
            UsuarioId = usuario.Id,
            NombreUsuario = usuario.NombreUsuario,
            Rol = usuario.Rol.ToString(),
            DebeCambiarPassword = usuario.DebeCambiarPassword,
            Permisos = PermisosSistema.ParaRol(usuario.Rol).ToList()
        };
    }
}
