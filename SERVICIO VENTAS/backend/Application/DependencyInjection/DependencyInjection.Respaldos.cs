using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Respaldos.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddRespaldoHandlers(this IServiceCollection services)
    {
        services.AddScoped<IListarRespaldosHandler, ListarRespaldosHandler>();
        services.AddScoped<IGetRespaldoConfiguracionHandler, GetRespaldoConfiguracionHandler>();
        services.AddScoped<IUpdateRespaldoConfiguracionHandler, UpdateRespaldoConfiguracionHandler>();
        services.AddScoped<IDescargarRespaldoHandler, DescargarRespaldoHandler>();
        services.AddScoped<ICrearRespaldoHandler, CrearRespaldoHandler>();
        services.AddScoped<IRestaurarRespaldoHandler, RestaurarRespaldoHandler>();
        return services;
    }
}
