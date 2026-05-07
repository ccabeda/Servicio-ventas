using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Usuarios.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class UpdateUsuarioHandler(IMapper mapper, IUsuarioRepositoryCommand commandRepo, IUsuarioRepositoryQuery queryRepo) : IUpdateUsuarioHandler
{
    private readonly PasswordHasher<Usuario> _hasher = new();

    public async Task<UsuarioDto> Handle(UpdateUsuarioCommand command)
    {
        var usuario = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Usuario no encontrado.");
        var request = command.Usuario;

        var nombreUsuario = request.NombreUsuario.Trim();
        if (await queryRepo.ExistsByNombreUsuarioAsync(nombreUsuario, usuario.Id))
            throw new InvalidOperationException("Ya existe un usuario con ese nombre.");

        usuario.NombreUsuario = nombreUsuario;
        usuario.Rol = request.Rol;
        usuario.Activo = request.Activo;
        usuario.DebeCambiarPassword = request.DebeCambiarPassword;
        if (!string.IsNullOrWhiteSpace(request.Password))
            usuario.PasswordHash = _hasher.HashPassword(usuario, request.Password);

        await commandRepo.UpdateAsync(usuario);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<UsuarioDto>(usuario);
    }
}
