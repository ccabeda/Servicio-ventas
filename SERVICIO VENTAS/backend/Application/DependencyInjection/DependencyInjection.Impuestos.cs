using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Impuestos.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddImpuestoHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateImpuestoHandler, CreateImpuestoHandler>();
        services.AddScoped<IUpdateImpuestoHandler, UpdateImpuestoHandler>();
        services.AddScoped<IDeleteImpuestoHandler, DeleteImpuestoHandler>();
        services.AddScoped<IGetImpuestosHandler, GetImpuestosHandler>();
        services.AddScoped<IGetImpuestoByIdHandler, GetImpuestoByIdHandler>();
        services.AddScoped<IGetImpuestoResumenHandler, GetImpuestoResumenHandler>();
        return services;
    }
}
