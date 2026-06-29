using ServicioVentas.Application.Services;

namespace ServicioVentas.API.Services;

public class RespaldoAutomaticoHostedService(
    IServiceScopeFactory scopeFactory,
    ILogger<RespaldoAutomaticoHostedService> logger) : BackgroundService
{
    private static readonly TimeSpan StartupDelay = TimeSpan.FromSeconds(10);
    private static readonly TimeSpan CheckInterval = TimeSpan.FromMinutes(5);
    private static readonly Action<ILogger, string, Exception?> RespaldoAutomaticoCreado =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            new EventId(6001, nameof(RespaldoAutomaticoCreado)),
            "Respaldo automático creado: {NombreArchivo}");

    private static readonly Action<ILogger, Exception?> RespaldoAutomaticoFallido =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(6002, nameof(RespaldoAutomaticoFallido)),
            "No se pudo ejecutar el respaldo automático.");

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(StartupDelay, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await EjecutarSiCorresponde(stoppingToken);
            await Task.Delay(CheckInterval, stoppingToken);
        }
    }

    private async Task EjecutarSiCorresponde(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var respaldoService = scope.ServiceProvider.GetRequiredService<IRespaldoService>();
            var respaldo = await respaldoService.CrearAutomaticoPendienteAsync(DateTimeOffset.Now);

            if (respaldo is not null)
            {
                RespaldoAutomaticoCreado(logger, respaldo.NombreArchivo, null);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            RespaldoAutomaticoFallido(logger, ex);
        }
    }
}
