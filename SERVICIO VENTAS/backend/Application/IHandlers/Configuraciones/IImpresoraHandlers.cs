using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateImpresoraHandler
{
    Task<ImpresoraDto> Handle(CreateImpresoraCommand command);
}

public interface IUpdateImpresoraHandler
{
    Task<ImpresoraDto> Handle(UpdateImpresoraCommand command);
}

public interface IDeleteImpresoraHandler
{
    Task Handle(DeleteImpresoraCommand command);
}

public interface IGetImpresorasHandler
{
    Task<List<ImpresoraDto>> Handle(GetImpresorasQuery query);
}

public interface IGetImpresoraByIdHandler
{
    Task<ImpresoraDto> Handle(GetImpresoraByIdQuery query);
}

public interface IPrintTicketPruebaImpresoraHandler
{
    Task Handle(PrintTicketPruebaImpresoraCommand command);
}
