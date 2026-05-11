using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Cajas.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddCajaHandlers(this IServiceCollection services)
    {
        services.AddScoped<IAbrirCajaHandler, AbrirCajaHandler>();
        services.AddScoped<ICerrarCajaHandler, CerrarCajaHandler>();
        services.AddScoped<IRegistrarMovimientoCajaHandler, RegistrarMovimientoCajaHandler>();
        services.AddScoped<IGetCajaActualHandler, GetCajaActualHandler>();
        services.AddScoped<IGetHistorialCajasHandler, GetHistorialCajasHandler>();
        services.AddScoped<IGetMovimientosCajaHandler, GetMovimientosCajaHandler>();
        return services;
    }
}
