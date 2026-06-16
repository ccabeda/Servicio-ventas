using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Auditoria.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddAuditoriaHandlers(this IServiceCollection services)
    {
        services.AddScoped<IAuditoriaService, AuditoriaService>();
        services.AddScoped<IGetAuditoriaEventosHandler, GetAuditoriaEventosHandler>();
        services.AddScoped<IGetAuditoriaEventoByIdHandler, GetAuditoriaEventoByIdHandler>();
        return services;
    }
}
