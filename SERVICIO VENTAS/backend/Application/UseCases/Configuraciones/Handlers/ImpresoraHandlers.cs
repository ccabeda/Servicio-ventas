using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class CreateImpresoraHandler(
    IMapper mapper,
    IImpresoraRepositoryCommand commandRepo,
    IImpresoraRepositoryQuery queryRepo,
    IPrinterSystemService printerSystem) : ICreateImpresoraHandler
{
    public async Task<ImpresoraDto> Handle(CreateImpresoraCommand command)
    {
        var request = command.Impresora;
        Normalize(request);

        if (await queryRepo.ExistsByNombreAsync(request.Nombre))
            throw new InvalidOperationException("Ya existe una impresora configurada con ese nombre.");

        if (await queryRepo.ExistsByNombreSistemaAsync(request.NombreSistema))
            throw new InvalidOperationException("Esa impresora de Windows ya está configurada.");

        printerSystem.EnsureTicketPrinterIsAvailable(request.NombreSistema);

        if (request.EsPredeterminada)
            await ClearDefaultPrinter(commandRepo, queryRepo);

        var impresora = mapper.Map<Impresora>(request);
        await commandRepo.AddAsync(impresora);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ImpresoraDto>(impresora);
    }

    private static void Normalize(CreateImpresoraDto request)
    {
        request.Nombre = request.Nombre.Trim();
        request.NombreSistema = request.NombreSistema.Trim();
        request.Tipo = NormalizeTipo(request.Tipo);
        request.DensidadImpresion = NormalizeDensidad(request.DensidadImpresion);
        request.AnchoPapelMm = request.AnchoPapelMm is >= 40 and <= 120 ? request.AnchoPapelMm : 80;
    }

    internal static string NormalizeTipo(string? value) => value is "Ticket" or "Informes" or "Cocina" ? value : "Ticket";
    internal static string NormalizeDensidad(string? value) => value is "Baja" or "Media" or "Alta" ? value : "Media";

    internal static async Task ClearDefaultPrinter(IImpresoraRepositoryCommand commandRepo, IImpresoraRepositoryQuery queryRepo, int? excludeId = null)
    {
        var currentDefault = await queryRepo.GetPredeterminadaAsync();
        if (currentDefault is null || currentDefault.Id == excludeId) return;

        currentDefault.EsPredeterminada = false;
        await commandRepo.UpdateAsync(currentDefault);
    }
}

public class UpdateImpresoraHandler(
    IMapper mapper,
    IImpresoraRepositoryCommand commandRepo,
    IImpresoraRepositoryQuery queryRepo,
    IPrinterSystemService printerSystem) : IUpdateImpresoraHandler
{
    public async Task<ImpresoraDto> Handle(UpdateImpresoraCommand command)
    {
        var request = command.Impresora;
        request.Nombre = request.Nombre.Trim();
        request.NombreSistema = request.NombreSistema.Trim();
        request.Tipo = CreateImpresoraHandler.NormalizeTipo(request.Tipo);
        request.DensidadImpresion = CreateImpresoraHandler.NormalizeDensidad(request.DensidadImpresion);
        request.AnchoPapelMm = request.AnchoPapelMm is >= 40 and <= 120 ? request.AnchoPapelMm : 80;

        var impresora = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Impresora no encontrada.");

        if (await queryRepo.ExistsByNombreAsync(request.Nombre, impresora.Id))
            throw new InvalidOperationException("Ya existe una impresora configurada con ese nombre.");

        if (await queryRepo.ExistsByNombreSistemaAsync(request.NombreSistema, impresora.Id))
            throw new InvalidOperationException("Esa impresora de Windows ya está configurada.");

        printerSystem.EnsureTicketPrinterIsAvailable(request.NombreSistema);

        if (request.EsPredeterminada)
            await CreateImpresoraHandler.ClearDefaultPrinter(commandRepo, queryRepo, impresora.Id);

        mapper.Map(request, impresora);
        await commandRepo.UpdateAsync(impresora);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ImpresoraDto>(impresora);
    }
}

public class DeleteImpresoraHandler(IImpresoraRepositoryCommand commandRepo, IImpresoraRepositoryQuery queryRepo) : IDeleteImpresoraHandler
{
    public async Task Handle(DeleteImpresoraCommand command)
    {
        var impresora = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Impresora no encontrada.");
        impresora.Activa = false;
        impresora.EsPredeterminada = false;
        await commandRepo.UpdateAsync(impresora);
        await commandRepo.SaveChangesAsync();
    }
}

public class GetImpresorasHandler(IMapper mapper, IImpresoraRepositoryQuery queryRepo) : IGetImpresorasHandler
{
    public async Task<List<ImpresoraDto>> Handle(GetImpresorasQuery query)
    {
        return mapper.Map<List<ImpresoraDto>>(await queryRepo.GetActivasAsync());
    }
}

public class GetImpresoraByIdHandler(IMapper mapper, IImpresoraRepositoryQuery queryRepo) : IGetImpresoraByIdHandler
{
    public async Task<ImpresoraDto> Handle(GetImpresoraByIdQuery query)
    {
        var impresora = await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Impresora no encontrada.");
        return mapper.Map<ImpresoraDto>(impresora);
    }
}

public class PrintTicketPruebaImpresoraHandler(
    IImpresoraRepositoryQuery queryRepo,
    IPrinterSystemService printerSystem) : IPrintTicketPruebaImpresoraHandler
{
    public async Task Handle(PrintTicketPruebaImpresoraCommand command)
    {
        if (!command.ImpresoraId.HasValue)
        {
            printerSystem.PrintTestTicket(command.Request.ImpresoraNombre, command.Request);
            return;
        }

        var impresora = await queryRepo.GetByIdAsync(command.ImpresoraId.Value)
            ?? throw new KeyNotFoundException("Impresora no encontrada.");

        printerSystem.PrintTestTicket(impresora.NombreSistema, command.Request with
        {
            AnchoMm = command.Request.AnchoMm > 0 ? command.Request.AnchoMm : impresora.AnchoPapelMm,
            CorteAutomatico = command.Request.CorteAutomatico && impresora.CorteAutomatico
        });
    }
}
