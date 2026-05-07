using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Clientes.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddClienteHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateClienteHandler, CreateClienteHandler>();
        services.AddScoped<IUpdateClienteHandler, UpdateClienteHandler>();
        services.AddScoped<IDeleteClienteHandler, DeleteClienteHandler>();
        services.AddScoped<IGetClientesHandler, GetClientesHandler>();
        services.AddScoped<IGetClienteByIdHandler, GetClienteByIdHandler>();
        return services;
    }
}
