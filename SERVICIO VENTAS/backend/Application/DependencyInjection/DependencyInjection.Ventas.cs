using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Ventas.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddVentaHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateVentaHandler, CreateVentaHandler>();
        services.AddScoped<IGetVentasHandler, GetVentasHandler>();
        services.AddScoped<IGetVentaByIdHandler, GetVentaByIdHandler>();
        return services;
    }
}
