using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Productos.Handlers;

namespace ServicioVentas.Application;

public static partial class DependencyInjection
{
    private static IServiceCollection AddProductoHandlers(this IServiceCollection services)
    {
        services.AddScoped<ICreateProductoHandler, CreateProductoHandler>();
        services.AddScoped<IUpdateProductoHandler, UpdateProductoHandler>();
        services.AddScoped<IDeleteProductoHandler, DeleteProductoHandler>();
        services.AddScoped<IGetProductosHandler, GetProductosHandler>();
        services.AddScoped<IGetProductoByIdHandler, GetProductoByIdHandler>();
        return services;
    }
}
