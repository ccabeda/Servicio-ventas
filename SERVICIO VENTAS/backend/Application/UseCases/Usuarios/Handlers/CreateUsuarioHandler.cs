using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Usuarios.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class CreateUsuarioHandler(IMapper mapper, IUsuarioRepositoryCommand commandRepo, IUsuarioRepositoryQuery queryRepo, IClock clock) : ICreateUsuarioHandler
{
    private const string PasswordInicial = "1234";
    private readonly PasswordHasher<Usuario> _hasher = new();

    public async Task<UsuarioDto> Handle(CreateUsuarioCommand command)
    {
        var request = command.Usuario;

        var nombreUsuario = request.NombreUsuario.Trim();
        if (await queryRepo.ExistsByNombreUsuarioAsync(nombreUsuario))
            throw new InvalidOperationException("Ya existe un usuario con ese nombre.");

        var usuario = new Usuario
        {
            NombreUsuario = nombreUsuario,
            Rol = request.Rol,
            Activo = request.Activo,
            DebeCambiarPassword = true,
            FechaCreacion = clock.UtcNow
        };
        usuario.PasswordHash = _hasher.HashPassword(usuario, PasswordInicial);

        await commandRepo.AddAsync(usuario);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<UsuarioDto>(usuario);
    }
}
