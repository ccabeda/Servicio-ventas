using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Reportes.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddReporteHandlers(this IServiceCollection services)
    {
        services.AddScoped<IGetResumenVentasHandler, GetResumenVentasHandler>();
        services.AddScoped<IGetVentasPorPeriodoHandler, GetVentasPorPeriodoHandler>();
        services.AddScoped<IGetProductosMasVendidosHandler, GetProductosMasVendidosHandler>();
        return services;
    }
}
