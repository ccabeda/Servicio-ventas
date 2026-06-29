using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class CreateProductoHandler(
    IMapper mapper,
    IProductoRepositoryCommand productoRepositoryCommand,
    IProductoRepositoryQuery productoRepositoryQuery,
    ICategoriaProductoRepositoryQuery categoriaProductoRepositoryQuery,
    IMarcaProductoRepositoryQuery marcaProductoRepositoryQuery,
    IClock clock) : ICreateProductoHandler
{
    public async Task<ProductoDto> Handle(CreateProductoCommand command)
    {
        var request = command.Producto;

        if (decimal.Truncate(request.Stock) != request.Stock)
        {
            throw new InvalidOperationException("El stock debe ser un número entero.");
        }

        await ValidateCodesAsync(request.CodigoBarra, request.CodigoInterno);
        await ValidateCategoriaMarcaAsync(request.CategoriaId, request.MarcaId);

        var producto = mapper.Map<Producto>(request);
        producto.FechaCreacion = clock.UtcNow;

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
            throw new InvalidOperationException("Ya existe un producto con ese código de barras.");
        }

        if (normalizedCodigoInterno is not null &&
            await productoRepositoryQuery.ExistsByCodigoInternoAsync(normalizedCodigoInterno))
        {
            throw new InvalidOperationException("Ya existe un producto con ese código interno.");
        }
    }

    private static string? NormalizeNullable(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private async Task ValidateCategoriaMarcaAsync(int? categoriaId, int? marcaId)
    {
        if (categoriaId.HasValue && !await categoriaProductoRepositoryQuery.ExistsAsync(categoriaId.Value))
        {
            throw new InvalidOperationException("La categoría seleccionada no existe.");
        }

        if (marcaId.HasValue && !await marcaProductoRepositoryQuery.ExistsActiveAsync(marcaId.Value))
        {
            throw new InvalidOperationException("La marca seleccionada no existe o está inactiva.");
        }
    }
}
