using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Impuestos;
using ServicioVentas.Application.UseCases.Impuestos.Commands;
using ServicioVentas.Application.UseCases.Impuestos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateImpuestoHandler
{
    Task<ImpuestoDto> Handle(CreateImpuestoCommand command);
}

public interface IUpdateImpuestoHandler
{
    Task<ImpuestoDto> Handle(UpdateImpuestoCommand command);
}

public interface IDeleteImpuestoHandler
{
    Task Handle(DeleteImpuestoCommand command);
}

public interface IGetImpuestosHandler
{
    Task<List<ImpuestoDto>> Handle(GetImpuestosQuery query);
    Task<PagedResultDto<ImpuestoDto>> HandlePaged(GetImpuestosQuery query);
}

public interface IGetImpuestoByIdHandler
{
    Task<ImpuestoDto> Handle(GetImpuestoByIdQuery query);
}

public interface IGetImpuestoResumenHandler
{
    Task<ImpuestoResumenDto> Handle(GetImpuestoResumenQuery query);
}
