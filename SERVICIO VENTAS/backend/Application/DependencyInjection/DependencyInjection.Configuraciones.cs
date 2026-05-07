using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Configuraciones.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddConfiguracionHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateConfiguracionNegocioHandler, CreateConfiguracionNegocioHandler>();
        services.AddScoped<IUpdateConfiguracionNegocioHandler, UpdateConfiguracionNegocioHandler>();
        services.AddScoped<IDeleteConfiguracionNegocioHandler, DeleteConfiguracionNegocioHandler>();
        services.AddScoped<IGetConfiguracionesNegocioHandler, GetConfiguracionesNegocioHandler>();
        services.AddScoped<IGetConfiguracionNegocioByIdHandler, GetConfiguracionNegocioByIdHandler>();
        return services;
    }
}
