using FluentValidation;
using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.Validations.Configuraciones;

public class UpdateConfiguracionTicketDtoValidator : AbstractValidator<UpdateConfiguracionTicketDto>
{
    public UpdateConfiguracionTicketDtoValidator()
    {
        RuleFor(x => x.ImpresoraNombreSistema).MaximumLength(180);
        RuleFor(x => x.MensajeTicket).MaximumLength(500);

        RuleFor(x => x.AnchoPapelMm)
            .InclusiveBetween(40, 120)
            .WithMessage("El ancho del ticket debe estar entre 40 y 120 mm.");
    }
}
