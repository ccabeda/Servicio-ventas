using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class GetProductoByIdHandler(IMapper mapper, IProductoRepositoryQuery productoRepositoryQuery) : IGetProductoByIdHandler
{
    public async Task<ProductoDto> Handle(GetProductoByIdQuery query)
    {
        var producto = await productoRepositoryQuery.GetByIdAsync(query.Id)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        return mapper.Map<ProductoDto>(producto);
    }
}
