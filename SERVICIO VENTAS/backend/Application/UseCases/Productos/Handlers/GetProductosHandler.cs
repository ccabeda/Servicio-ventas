using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class GetProductosHandler(IMapper mapper, IProductoRepositoryQuery productoRepositoryQuery) : IGetProductosHandler
{
    public async Task<List<ProductoDto>> Handle(GetProductosQuery query)
    {
        var productos = await productoRepositoryQuery.GetAllAsync();
        return mapper.Map<List<ProductoDto>>(productos);
    }
}
