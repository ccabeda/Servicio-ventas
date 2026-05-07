using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class RegistrarMovimientoCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : IRegistrarMovimientoCajaHandler
{
    public async Task<MovimientoCajaDto> Handle(RegistrarMovimientoCajaCommand command)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(command.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!caja.Abierta)
        {
            throw new InvalidOperationException("No se pueden registrar movimientos en una caja cerrada.");
        }

        var request = command.Movimiento;

        if (request.Tipo is TipoMovimientoCaja.Apertura or TipoMovimientoCaja.Cierre)
        {
            throw new InvalidOperationException("Ese tipo de movimiento no se registra manualmente.");
        }

        var movimiento = new MovimientoCaja
        {
            CajaId = caja.Id,
            Fecha = DateTime.UtcNow,
            Tipo = request.Tipo,
            Concepto = request.Concepto.Trim(),
            Monto = request.Monto,
            UsuarioId = request.UsuarioId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<MovimientoCajaDto>(movimiento);
    }
}
