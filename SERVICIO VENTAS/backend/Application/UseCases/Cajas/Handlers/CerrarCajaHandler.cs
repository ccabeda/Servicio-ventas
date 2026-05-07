using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class CerrarCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : ICerrarCajaHandler
{
    public async Task<CajaDto> Handle(CerrarCajaCommand command)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(command.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!caja.Abierta)
        {
            throw new InvalidOperationException("La caja ya se encuentra cerrada.");
        }

        var request = command.Caja;
        var saldoSistema = await cajaRepositoryQuery.GetSaldoSistemaByCajaIdAsync(caja.Id);

        caja.FechaCierre = DateTime.UtcNow;
        caja.MontoFinal = request.MontoFinal;
        caja.Diferencia = request.MontoFinal - saldoSistema;
        caja.UsuarioCierreId = request.UsuarioCierreId;
        caja.Abierta = false;

        await cajaRepositoryCommand.UpdateCajaAsync(caja);

        var movimiento = new MovimientoCaja
        {
            CajaId = caja.Id,
            Fecha = DateTime.UtcNow,
            Tipo = TipoMovimientoCaja.Cierre,
            Concepto = "Cierre de caja",
            Monto = request.MontoFinal,
            UsuarioId = request.UsuarioCierreId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<CajaDto>(caja);
    }
}
