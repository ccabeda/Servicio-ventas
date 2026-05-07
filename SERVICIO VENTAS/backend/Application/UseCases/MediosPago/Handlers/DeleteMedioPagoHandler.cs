using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Commands;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class DeleteMedioPagoHandler(IMedioPagoRepositoryCommand commandRepo, IMedioPagoRepositoryQuery queryRepo) : IDeleteMedioPagoHandler
{
    public async Task Handle(DeleteMedioPagoCommand command)
    {
        var medioPago = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Medio de pago no encontrado.");
        medioPago.Activo = false;
        await commandRepo.UpdateAsync(medioPago);
        await commandRepo.SaveChangesAsync();
    }
}
