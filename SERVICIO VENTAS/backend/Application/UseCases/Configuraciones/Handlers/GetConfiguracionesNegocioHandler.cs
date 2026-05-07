using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class GetConfiguracionesNegocioHandler(IMapper mapper, IConfiguracionNegocioRepositoryQuery queryRepo) : IGetConfiguracionesNegocioHandler
{
    public async Task<List<ConfiguracionNegocioDto>> Handle(GetConfiguracionesNegocioQuery query) => mapper.Map<List<ConfiguracionNegocioDto>>(await queryRepo.GetAllAsync());
}
