using AutoMapper;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Commands;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class UpdateMedioPagoHandler(IMapper mapper, IMedioPagoRepositoryCommand commandRepo, IMedioPagoRepositoryQuery queryRepo) : IUpdateMedioPagoHandler
{
    public async Task<MedioPagoDto> Handle(UpdateMedioPagoCommand command)
    {
        var medioPago = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Medio de pago no encontrado.");
        var request = command.MedioPago;
        var nombre = request.Nombre.Trim();
        if (await queryRepo.ExistsByNombreAsync(nombre, medioPago.Id))
            throw new InvalidOperationException("Ya existe un medio de pago con ese nombre.");

        mapper.Map(request, medioPago);
        await commandRepo.UpdateAsync(medioPago);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<MedioPagoDto>(medioPago);
    }
}
