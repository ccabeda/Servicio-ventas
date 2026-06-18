using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class UploadConfiguracionNegocioLogoHandler(
    IMapper mapper,
    IConfiguracionNegocioRepositoryQuery queryRepo,
    IConfiguracionNegocioRepositoryCommand commandRepo,
    ILogoStorageService logoStorage) : IUploadConfiguracionNegocioLogoHandler
{
    public async Task<ConfiguracionNegocioDto> Handle(UploadConfiguracionNegocioLogoCommand command)
    {
        if (command.Archivo is null)
        {
            throw new InvalidOperationException("Selecciona un archivo de logo.");
        }

        var configuracion = await queryRepo.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Configuración no encontrada.");

        configuracion.LogoUrl = await logoStorage.SaveLogoAsync(command.Archivo, configuracion.LogoUrl, command.CancellationToken);
        await commandRepo.UpdateAsync(configuracion);
        await commandRepo.SaveChangesAsync();

        return mapper.Map<ConfiguracionNegocioDto>(configuracion);
    }
}
