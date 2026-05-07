using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Usuarios.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddUsuarioHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateUsuarioHandler, CreateUsuarioHandler>();
        services.AddScoped<IUpdateUsuarioHandler, UpdateUsuarioHandler>();
        services.AddScoped<IDeleteUsuarioHandler, DeleteUsuarioHandler>();
        services.AddScoped<IGetUsuariosHandler, GetUsuariosHandler>();
        services.AddScoped<IGetUsuarioByIdHandler, GetUsuarioByIdHandler>();
        return services;
    }
}
