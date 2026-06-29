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

public class AbrirCajaHandler(
    IMapper mapper,
    ICajaRepositoryCommand cajaRepositoryCommand,
    ICajaRepositoryQuery cajaRepositoryQuery,
    IConfiguracionNegocioRepositoryQuery configuracionQueryRepo,
    IClock clock,
    IAuditoriaService auditoriaService,
    ILogger<AbrirCajaHandler> logger,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : IAbrirCajaHandler
{
    private static readonly Action<ILogger, int, decimal, Exception?> CajaAbierta =
        LoggerMessage.Define<int, decimal>(
            LogLevel.Information,
            new EventId(2001, nameof(CajaAbierta)),
            "Caja abierta por usuario {UsuarioId} con monto inicial {MontoInicial}.");

    public async Task<CajaDto> Handle(AbrirCajaCommand command)
    {
        var request = command.Caja;

        var cajaAbierta = await cajaRepositoryQuery.GetCajaAbiertaAsync();
        if (cajaAbierta is not null)
        {
            throw new InvalidOperationException("Ya existe una caja abierta.");
        }

        var configuracion = await configuracionQueryRepo.GetPrincipalAsync();
        var montoMinimo = configuracion?.MontoMinimoAperturaCaja ?? 0m;
        if (request.MontoInicial < montoMinimo)
        {
            throw new InvalidOperationException($"El monto inicial debe ser al menos {montoMinimo:0.##}.");
        }

        var caja = new Caja
        {
            FechaApertura = clock.UtcNow,
            MontoInicial = request.MontoInicial,
            Abierta = true,
            UsuarioAperturaId = command.UsuarioId
        };

        await cajaRepositoryCommand.AddCajaAsync(caja);

        var movimiento = new MovimientoCaja
        {
            Caja = caja,
            Fecha = clock.UtcNow,
            Tipo = TipoMovimientoCaja.Apertura,
            Concepto = "Apertura de caja",
            Monto = request.MontoInicial,
            UsuarioId = command.UsuarioId
        };

        await cajaRepositoryCommand.AddMovimientoAsync(movimiento);
        await auditoriaService.RegistrarAsync(new RegistrarAuditoriaEventoDto
        {
            UsuarioId = command.UsuarioId,
            Modulo = "Caja",
            Accion = "Apertura",
            Entidad = "Caja",
            Detalle = $"Caja abierta con monto inicial {request.MontoInicial:0.##}.",
            ValoresNuevosJson = JsonSerializer.Serialize(new { montoInicial = request.MontoInicial })
        });
        await unitOfWork.SaveChangesAsync();
        CajaAbierta(logger, command.UsuarioId, request.MontoInicial, null);

        return mapper.Map<CajaDto>(caja);
    }
}
