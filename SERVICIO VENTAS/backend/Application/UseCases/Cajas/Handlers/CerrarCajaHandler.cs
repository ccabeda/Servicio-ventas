using System.Globalization;
using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Logging;
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

public class CerrarCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    IConfiguracionNegocioRepositoryQuery configuracionQueryRepo,
    IClock clock,
    IAuditoriaService auditoriaService,
    ILogger<CerrarCajaHandler> logger,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : ICerrarCajaHandler
{
    private static readonly Action<ILogger, int, int, decimal, decimal?, Exception?> CajaCerrada =
        LoggerMessage.Define<int, int, decimal, decimal?>(
            LogLevel.Information,
            new EventId(2003, nameof(CajaCerrada)),
            "Caja {CajaId} cerrada por usuario {UsuarioId}. Monto final {MontoFinal}. Diferencia {Diferencia}.");

    public async Task<CajaDto> Handle(CerrarCajaCommand command)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(command.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!command.EsAdmin && caja.UsuarioAperturaId != command.UsuarioId)
        {
            throw new ServicioVentas.Application.Exceptions.ForbiddenAccessException("No tienes permisos para cerrar esa caja.");
        }

        if (!caja.Abierta)
        {
            throw new InvalidOperationException("La caja ya se encuentra cerrada.");
        }

        var request = command.Caja;
        var configuracion = await configuracionQueryRepo.GetPrincipalAsync();
        if (configuracion?.PedirMotivoCerrarCaja != false && string.IsNullOrWhiteSpace(request.MotivoCierre))
        {
            throw new InvalidOperationException("El motivo de cierre de caja es obligatorio.");
        }

        var saldoSistema = await cajaRepositoryQuery.GetSaldoSistemaByCajaIdAsync(caja.Id);

        caja.FechaCierre = clock.UtcNow;
        caja.MontoFinal = request.MontoFinal;
        caja.Diferencia = request.MontoFinal - saldoSistema;
        caja.MotivoCierre = string.IsNullOrWhiteSpace(request.MotivoCierre) ? null : request.MotivoCierre.Trim();
        caja.UsuarioCierreId = command.UsuarioId;
        caja.Abierta = false;

        await cajaRepositoryCommand.UpdateCajaAsync(caja);

        var movimiento = new MovimientoCaja
        {
            CajaId = caja.Id,
            Fecha = clock.UtcNow,
            Tipo = TipoMovimientoCaja.Cierre,
            Concepto = "Cierre de caja",
            Monto = request.MontoFinal,
            UsuarioId = command.UsuarioId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await auditoriaService.RegistrarAsync(new RegistrarAuditoriaEventoDto
        {
            UsuarioId = command.UsuarioId,
            Modulo = "Caja",
            Accion = "Cierre",
            Entidad = "Caja",
            EntidadId = caja.Id.ToString(CultureInfo.InvariantCulture),
            Detalle = $"Caja {caja.Id} cerrada con monto final {request.MontoFinal:0.##} y diferencia {caja.Diferencia:0.##}.",
            ValoresNuevosJson = JsonSerializer.Serialize(new
            {
                montoFinal = request.MontoFinal,
                saldoSistema,
                diferencia = caja.Diferencia,
                motivo = caja.MotivoCierre
            })
        });
        await unitOfWork.SaveChangesAsync();
        CajaCerrada(logger, caja.Id, command.UsuarioId, request.MontoFinal, caja.Diferencia, null);

        return mapper.Map<CajaDto>(caja);
    }
}
