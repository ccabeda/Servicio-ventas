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
        services.AddScoped<IAjustarStockProductoHandler, AjustarStockProductoHandler>();
        services.AddScoped<IGetMovimientosStockProductoHandler, GetMovimientosStockProductoHandler>();
        services.AddScoped<ICreateCategoriaProductoHandler, CreateCategoriaProductoHandler>();
        services.AddScoped<IUpdateCategoriaProductoHandler, UpdateCategoriaProductoHandler>();
        services.AddScoped<IDeleteCategoriaProductoHandler, DeleteCategoriaProductoHandler>();
        services.AddScoped<IGetCategoriasProductoHandler, GetCategoriasProductoHandler>();
        services.AddScoped<IGetCategoriaProductoByIdHandler, GetCategoriaProductoByIdHandler>();
        services.AddScoped<ICreateMarcaProductoHandler, CreateMarcaProductoHandler>();
        services.AddScoped<IUpdateMarcaProductoHandler, UpdateMarcaProductoHandler>();
        services.AddScoped<IDeleteMarcaProductoHandler, DeleteMarcaProductoHandler>();
        services.AddScoped<IGetMarcasProductoHandler, GetMarcasProductoHandler>();
        services.AddScoped<IGetMarcaProductoByIdHandler, GetMarcaProductoByIdHandler>();
        return services;
    }
}
