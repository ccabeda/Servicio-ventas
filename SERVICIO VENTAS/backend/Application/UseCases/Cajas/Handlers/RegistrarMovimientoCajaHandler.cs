using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class RegistrarMovimientoCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    IClock clock,
    IAuditoriaService auditoriaService,
    ILogger<RegistrarMovimientoCajaHandler> logger,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : IRegistrarMovimientoCajaHandler
{
    public async Task<MovimientoCajaDto> Handle(RegistrarMovimientoCajaCommand command)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(command.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!command.EsAdmin && caja.UsuarioAperturaId != command.UsuarioId)
        {
            throw new ServicioVentas.Application.Exceptions.ForbiddenAccessException("No tienes permisos para registrar movimientos en esa caja.");
        }

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
            Fecha = clock.UtcNow,
            Tipo = request.Tipo,
            Concepto = request.Concepto.Trim(),
            Monto = request.Monto,
            UsuarioId = command.UsuarioId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await auditoriaService.RegistrarAsync(new RegistrarAuditoriaEventoDto
        {
            UsuarioId = command.UsuarioId,
            Modulo = "Caja",
            Accion = request.Tipo.ToString(),
            Entidad = "Caja",
            EntidadId = caja.Id.ToString(),
            Detalle = $"{request.Tipo} en caja {caja.Id}: {request.Concepto.Trim()} por {request.Monto:0.##}.",
            ValoresNuevosJson = JsonSerializer.Serialize(new
            {
                tipo = request.Tipo.ToString(),
                concepto = request.Concepto.Trim(),
                monto = request.Monto
            })
        });
        await unitOfWork.SaveChangesAsync();
        logger.LogInformation(
            "Movimiento de caja registrado. Caja {CajaId}, usuario {UsuarioId}, tipo {Tipo}, monto {Monto}.",
            caja.Id,
            command.UsuarioId,
            request.Tipo,
            request.Monto);

        return mapper.Map<MovimientoCajaDto>(movimiento);
    }
}
