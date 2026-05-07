using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class UpdateProductoHandler(
    IMapper mapper,
    IProductoRepositoryCommand productoRepositoryCommand,
    IProductoRepositoryQuery productoRepositoryQuery) : IUpdateProductoHandler
{
    public async Task<ProductoDto> Handle(UpdateProductoCommand command)
    {
        var producto = await productoRepositoryQuery.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        var request = command.Producto;

        await ValidateCodesAsync(request.CodigoBarra, request.CodigoInterno, producto.Id);

        mapper.Map(request, producto);
        producto.FechaActualizacion = DateTime.UtcNow;

        await productoRepositoryCommand.UpdateAsync(producto);
        await productoRepositoryCommand.SaveChangesAsync();

        return mapper.Map<ProductoDto>(producto);
    }

    private async Task ValidateCodesAsync(string? codigoBarra, string? codigoInterno, int productoId)
    {
        var normalizedCodigoBarra = NormalizeNullable(codigoBarra);
        var normalizedCodigoInterno = NormalizeNullable(codigoInterno);

        if (normalizedCodigoBarra is not null &&
            await productoRepositoryQuery.ExistsByCodigoBarraAsync(normalizedCodigoBarra, productoId))
        {
            throw new InvalidOperationException("Ya existe un producto con ese codigo de barras.");
        }

        if (normalizedCodigoInterno is not null &&
            await productoRepositoryQuery.ExistsByCodigoInternoAsync(normalizedCodigoInterno, productoId))
        {
            throw new InvalidOperationException("Ya existe un producto con ese codigo interno.");
        }
    }

    private static string? NormalizeNullable(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
