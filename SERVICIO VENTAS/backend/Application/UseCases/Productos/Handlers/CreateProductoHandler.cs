using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class CreateProductoHandler(
    IMapper mapper,
    IProductoRepositoryCommand productoRepositoryCommand,
    IProductoRepositoryQuery productoRepositoryQuery) : ICreateProductoHandler
{
    public async Task<ProductoDto> Handle(CreateProductoCommand command)
    {
        var request = command.Producto;

        await ValidateCodesAsync(request.CodigoBarra, request.CodigoInterno);

        var producto = mapper.Map<Producto>(request);
        producto.FechaCreacion = DateTime.UtcNow;

        await productoRepositoryCommand.AddAsync(producto);
        await productoRepositoryCommand.SaveChangesAsync();

        return mapper.Map<ProductoDto>(producto);
    }

    private async Task ValidateCodesAsync(string? codigoBarra, string? codigoInterno)
    {
        var normalizedCodigoBarra = NormalizeNullable(codigoBarra);
        var normalizedCodigoInterno = NormalizeNullable(codigoInterno);

        if (normalizedCodigoBarra is not null &&
            await productoRepositoryQuery.ExistsByCodigoBarraAsync(normalizedCodigoBarra))
        {
            throw new InvalidOperationException("Ya existe un producto con ese codigo de barras.");
        }

        if (normalizedCodigoInterno is not null &&
            await productoRepositoryQuery.ExistsByCodigoInternoAsync(normalizedCodigoInterno))
        {
            throw new InvalidOperationException("Ya existe un producto con ese codigo interno.");
        }
    }

    private static string? NormalizeNullable(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
