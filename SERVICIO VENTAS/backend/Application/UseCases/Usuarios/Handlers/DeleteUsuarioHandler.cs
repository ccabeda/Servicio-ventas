using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Usuarios.Commands;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class DeleteUsuarioHandler(IUsuarioRepositoryCommand commandRepo, IUsuarioRepositoryQuery queryRepo) : IDeleteUsuarioHandler
{
    public async Task Handle(DeleteUsuarioCommand command)
    {
        var usuario = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Usuario no encontrado.");
        usuario.Activo = false;
        await commandRepo.UpdateAsync(usuario);
        await commandRepo.SaveChangesAsync();
    }
}
