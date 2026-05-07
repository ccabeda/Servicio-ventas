using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Clientes.Commands;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class DeleteClienteHandler(IClienteRepositoryCommand commandRepo, IClienteRepositoryQuery queryRepo) : IDeleteClienteHandler
{
    public async Task Handle(DeleteClienteCommand command)
    {
        var cliente = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Cliente no encontrado.");
        cliente.Activo = false;
        await commandRepo.UpdateAsync(cliente);
        await commandRepo.SaveChangesAsync();
    }
}
