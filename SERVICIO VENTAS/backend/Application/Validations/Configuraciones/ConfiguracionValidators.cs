using FluentValidation;
using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.Validations.Configuraciones;

public class CreateConfiguracionNegocioDtoValidator : AbstractValidator<CreateConfiguracionNegocioDto>
{
    public CreateConfiguracionNegocioDtoValidator()
    {
        RuleFor(x => x.NombreNegocio)
            .NotEmpty().WithMessage("El nombre del negocio es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Direccion)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.Direccion));

        RuleFor(x => x.Telefono)
            .MaximumLength(30)
            .When(x => !string.IsNullOrWhiteSpace(x.Telefono));

        RuleFor(x => x.LogoUrl)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.LogoUrl));

        RuleFor(x => x.MensajeTicket)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.MensajeTicket));

        RuleFor(x => x.ImpresoraTicket)
            .MaximumLength(150)
            .When(x => !string.IsNullOrWhiteSpace(x.ImpresoraTicket));
    }
}

public class UpdateConfiguracionNegocioDtoValidator : AbstractValidator<UpdateConfiguracionNegocioDto>
{
    public UpdateConfiguracionNegocioDtoValidator()
    {
        RuleFor(x => x.NombreNegocio)
            .NotEmpty().WithMessage("El nombre del negocio es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Direccion)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.Direccion));

        RuleFor(x => x.Telefono)
            .MaximumLength(30)
            .When(x => !string.IsNullOrWhiteSpace(x.Telefono));

        RuleFor(x => x.LogoUrl)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.LogoUrl));

        RuleFor(x => x.MensajeTicket)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.MensajeTicket));

        RuleFor(x => x.ImpresoraTicket)
            .MaximumLength(150)
            .When(x => !string.IsNullOrWhiteSpace(x.ImpresoraTicket));
    }
}
