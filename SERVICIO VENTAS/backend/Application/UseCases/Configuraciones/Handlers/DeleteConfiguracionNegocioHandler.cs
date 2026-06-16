using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class DeleteConfiguracionNegocioHandler(IConfiguracionNegocioRepositoryQuery queryRepo, IConfiguracionNegocioRepositoryCommand commandRepo) : IDeleteConfiguracionNegocioHandler
{
    public async Task Handle(DeleteConfiguracionNegocioCommand command)
    {
        var configuracion = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Configuración no encontrada.");
        await commandRepo.UpdateAsync(configuracion);
        await commandRepo.SaveChangesAsync();
    }
}
