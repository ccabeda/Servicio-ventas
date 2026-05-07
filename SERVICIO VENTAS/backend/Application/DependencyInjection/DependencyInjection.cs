using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.Mapping;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(_ => { }, typeof(PosMappingProfile).Assembly);

        services
            .AddAuthHandlers()
            .AddCajaHandlers()
            .AddClienteHandlers()
            .AddConfiguracionHandlers()
            .AddMedioPagoHandlers()
            .AddProductoHandlers()
            .AddReporteHandlers()
            .AddUsuarioHandlers()
            .AddVentaHandlers();

        return services;
    }
}
