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
        var existente = await queryRepo.GetByNombreAsync(nombre);

        if (existente is not null && existente.Activo)
            throw new InvalidOperationException("Ya existe un medio de pago con ese nombre.");

        if (existente is not null)
        {
            existente.Nombre = nombre;
            existente.Activo = true;
            await commandRepo.UpdateAsync(existente);
            await commandRepo.SaveChangesAsync();
            return mapper.Map<MedioPagoDto>(existente);
        }

        var medioPago = mapper.Map<MedioPago>(request);
        medioPago.Nombre = nombre;
        await commandRepo.AddAsync(medioPago);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<MedioPagoDto>(medioPago);
    }
}
