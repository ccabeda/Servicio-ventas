using AutoMapper;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Impuestos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Impuestos.Commands;
using ServicioVentas.Application.UseCases.Impuestos.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Impuestos.Handlers;

public class CreateImpuestoHandler(IMapper mapper, IImpuestoRepositoryCommand commandRepo, IImpuestoRepositoryQuery queryRepo) : ICreateImpuestoHandler
{
    public async Task<ImpuestoDto> Handle(CreateImpuestoCommand command)
    {
        var request = command.Impuesto;
        var nombre = request.Nombre.Trim();
        ValidateImpuesto(nombre, request.Porcentaje);

        var existente = await queryRepo.GetByNombreAsync(nombre);
        if (existente is not null && existente.Activo)
            throw new InvalidOperationException("Ya existe una tasa de impuesto con ese nombre.");

        if (request.EsPredeterminado)
        {
            await ClearPredeterminadoAsync(commandRepo, queryRepo);
        }

        if (existente is not null)
        {
            existente.Nombre = nombre;
            existente.Porcentaje = request.Porcentaje;
            existente.Activo = request.Activo;
            existente.EsPredeterminado = request.EsPredeterminado;
            await commandRepo.UpdateAsync(existente);
            await commandRepo.SaveChangesAsync();
            return mapper.Map<ImpuestoDto>(existente);
        }

        var impuesto = mapper.Map<Impuesto>(request);
        impuesto.Nombre = nombre;
        await commandRepo.AddAsync(impuesto);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ImpuestoDto>(impuesto);
    }

    private static async Task ClearPredeterminadoAsync(IImpuestoRepositoryCommand commandRepo, IImpuestoRepositoryQuery queryRepo)
    {
        var predeterminado = await queryRepo.GetPredeterminadoAsync();
        if (predeterminado is null) return;

        predeterminado.EsPredeterminado = false;
        await commandRepo.UpdateAsync(predeterminado);
    }

    private static void ValidateImpuesto(string nombre, decimal porcentaje)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            throw new InvalidOperationException("El nombre del impuesto es obligatorio.");

        if (porcentaje is < 0 or > 100)
            throw new InvalidOperationException("El porcentaje debe estar entre 0 y 100.");
    }
}

public class UpdateImpuestoHandler(IMapper mapper, IImpuestoRepositoryCommand commandRepo, IImpuestoRepositoryQuery queryRepo) : IUpdateImpuestoHandler
{
    public async Task<ImpuestoDto> Handle(UpdateImpuestoCommand command)
    {
        var impuesto = await queryRepo.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Impuesto no encontrado.");

        var request = command.Impuesto;
        var nombre = request.Nombre.Trim();
        ValidateImpuesto(nombre, request.Porcentaje);

        if (await queryRepo.ExistsByNombreAsync(nombre, command.Id))
            throw new InvalidOperationException("Ya existe una tasa de impuesto con ese nombre.");

        if (request.EsPredeterminado)
        {
            var predeterminado = await queryRepo.GetPredeterminadoAsync();
            if (predeterminado is not null && predeterminado.Id != impuesto.Id)
            {
                predeterminado.EsPredeterminado = false;
                await commandRepo.UpdateAsync(predeterminado);
            }
        }

        impuesto.Nombre = nombre;
        impuesto.Porcentaje = request.Porcentaje;
        impuesto.Activo = request.Activo;
        impuesto.EsPredeterminado = request.EsPredeterminado;

        await commandRepo.UpdateAsync(impuesto);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ImpuestoDto>(impuesto);
    }

    private static void ValidateImpuesto(string nombre, decimal porcentaje)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            throw new InvalidOperationException("El nombre del impuesto es obligatorio.");

        if (porcentaje is < 0 or > 100)
            throw new InvalidOperationException("El porcentaje debe estar entre 0 y 100.");
    }
}

public class DeleteImpuestoHandler(IImpuestoRepositoryCommand commandRepo, IImpuestoRepositoryQuery queryRepo) : IDeleteImpuestoHandler
{
    public async Task Handle(DeleteImpuestoCommand command)
    {
        var impuesto = await queryRepo.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Impuesto no encontrado.");

        if (impuesto.EsPredeterminado)
            throw new InvalidOperationException("No se puede desactivar el impuesto predeterminado.");

        impuesto.Activo = false;
        await commandRepo.UpdateAsync(impuesto);
        await commandRepo.SaveChangesAsync();
    }
}

public class GetImpuestosHandler(IMapper mapper, IImpuestoRepositoryQuery queryRepo) : IGetImpuestosHandler
{
    public async Task<List<ImpuestoDto>> Handle(GetImpuestosQuery query) => mapper.Map<List<ImpuestoDto>>(await queryRepo.GetAllAsync());

    public async Task<PagedResultDto<ImpuestoDto>> HandlePaged(GetImpuestosQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (impuestos, totalItems) = await queryRepo.GetPagedAsync(pageIndex, pageSize, query.Search, query.Estado);

        return new PagedResultDto<ImpuestoDto>
        {
            Items = mapper.Map<List<ImpuestoDto>>(impuestos),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}

public class GetImpuestoByIdHandler(IMapper mapper, IImpuestoRepositoryQuery queryRepo) : IGetImpuestoByIdHandler
{
    public async Task<ImpuestoDto> Handle(GetImpuestoByIdQuery query)
    {
        var impuesto = await queryRepo.GetByIdAsync(query.Id)
            ?? throw new KeyNotFoundException("Impuesto no encontrado.");
        return mapper.Map<ImpuestoDto>(impuesto);
    }
}

public class GetImpuestoResumenHandler(IMapper mapper, IImpuestoRepositoryQuery queryRepo) : IGetImpuestoResumenHandler
{
    public async Task<ImpuestoResumenDto> Handle(GetImpuestoResumenQuery query)
    {
        return new ImpuestoResumenDto
        {
            TasasActivas = await queryRepo.CountActivosAsync(),
            ProductosSinTasa = await queryRepo.CountProductosSinTasaAsync(),
            Predeterminado = mapper.Map<ImpuestoDto?>(await queryRepo.GetPredeterminadoAsync())
        };
    }
}
