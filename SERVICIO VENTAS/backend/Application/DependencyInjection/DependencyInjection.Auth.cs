using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Auth.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddAuthHandlers(this IServiceCollection services)
    {
        services.AddScoped<ILoginHandler, LoginHandler>();
        services.AddScoped<IGetCurrentUserHandler, GetCurrentUserHandler>();
        services.AddScoped<ICambiarPasswordHandler, CambiarPasswordHandler>();
        return services;
    }
}
