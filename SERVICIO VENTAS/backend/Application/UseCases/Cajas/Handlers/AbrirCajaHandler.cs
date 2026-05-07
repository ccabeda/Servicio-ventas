using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class AbrirCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : IAbrirCajaHandler
{
    public async Task<CajaDto> Handle(AbrirCajaCommand command)
    {
        var request = command.Caja;

        var cajaAbierta = await cajaRepositoryQuery.GetCajaAbiertaAsync();
        if (cajaAbierta is not null)
        {
            throw new InvalidOperationException("Ya existe una caja abierta.");
        }

        var caja = new Caja
        {
            FechaApertura = DateTime.UtcNow,
            MontoInicial = request.MontoInicial,
            Abierta = true,
            UsuarioAperturaId = request.UsuarioAperturaId
        };

        await cajaRepositoryCommand.AddCajaAsync(caja);

        var movimiento = new MovimientoCaja
        {
            CajaId = caja.Id,
            Fecha = DateTime.UtcNow,
            Tipo = TipoMovimientoCaja.Apertura,
            Concepto = "Apertura de caja",
            Monto = request.MontoInicial,
            UsuarioId = request.UsuarioAperturaId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<CajaDto>(caja);
    }
}
