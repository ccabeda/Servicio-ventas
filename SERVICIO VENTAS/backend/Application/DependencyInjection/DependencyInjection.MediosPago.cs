using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.MediosPago.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddMedioPagoHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateMedioPagoHandler, CreateMedioPagoHandler>();
        services.AddScoped<IUpdateMedioPagoHandler, UpdateMedioPagoHandler>();
        services.AddScoped<IDeleteMedioPagoHandler, DeleteMedioPagoHandler>();
        services.AddScoped<IGetMediosPagoHandler, GetMediosPagoHandler>();
        services.AddScoped<IGetMedioPagoByIdHandler, GetMedioPagoByIdHandler>();
        return services;
    }
}
