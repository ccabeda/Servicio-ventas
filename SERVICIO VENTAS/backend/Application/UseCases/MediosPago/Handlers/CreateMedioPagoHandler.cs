using AutoMapper;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class CreateMedioPagoHandler(IMapper mapper, IMedioPagoRepositoryCommand commandRepo, IMedioPagoRepositoryQuery queryRepo) : ICreateMedioPagoHandler
{
    public async Task<MedioPagoDto> Handle(CreateMedioPagoCommand command)
    {
        var request = command.MedioPago;
        var nombre = request.Nombre.Trim();
        if (await queryRepo.ExistsByNombreAsync(nombre))
            throw new InvalidOperationException("Ya existe un medio de pago con ese nombre.");

        var medioPago = mapper.Map<MedioPago>(request);
        await commandRepo.AddAsync(medioPago);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<MedioPagoDto>(medioPago);
    }
}
