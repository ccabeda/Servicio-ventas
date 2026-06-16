using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class GetConfiguracionTicketPrincipalHandler(
    IMapper mapper,
    IConfiguracionTicketRepositoryQuery queryRepo,
    IConfiguracionTicketRepositoryCommand commandRepo) : IGetConfiguracionTicketPrincipalHandler
{
    public async Task<ConfiguracionTicketDto> Handle(GetConfiguracionTicketPrincipalQuery query)
    {
        var configuracion = await queryRepo.GetPrincipalAsync();

        if (configuracion is null)
        {
            configuracion = new ConfiguracionTicket();
            await commandRepo.AddAsync(configuracion);
            await commandRepo.SaveChangesAsync();
        }

        return mapper.Map<ConfiguracionTicketDto>(configuracion);
    }
}

public class UpdateConfiguracionTicketHandler(
    IMapper mapper,
    IConfiguracionTicketRepositoryCommand commandRepo,
    IConfiguracionTicketRepositoryQuery queryRepo,
    IImpresoraRepositoryQuery impresoraRepo) : IUpdateConfiguracionTicketHandler
{
    public async Task<ConfiguracionTicketDto> Handle(UpdateConfiguracionTicketCommand command)
    {
        var configuracion = await queryRepo.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Configuración de ticket no encontrada.");

        if (command.Configuracion.ImpresoraId.HasValue &&
            await impresoraRepo.GetByIdAsync(command.Configuracion.ImpresoraId.Value) is null)
        {
            throw new KeyNotFoundException("Impresora no encontrada.");
        }

        mapper.Map(command.Configuracion, configuracion);
        await commandRepo.UpdateAsync(configuracion);
        await commandRepo.SaveChangesAsync();

        return mapper.Map<ConfiguracionTicketDto>(configuracion);
    }
}
