using AutoMapper;
using ServicioVentas.Application.DTOs.Common;
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

    public async Task<PagedResultDto<ProductoDto>> HandlePaged(GetProductosQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 20);
        var (productos, totalItems) = await productoRepositoryQuery.GetPagedAsync(
            pageIndex,
            pageSize,
            query.Search,
            query.CategoriaId,
            query.MarcaId,
            query.Estado);

        return new PagedResultDto<ProductoDto>
        {
            Items = mapper.Map<List<ProductoDto>>(productos),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
