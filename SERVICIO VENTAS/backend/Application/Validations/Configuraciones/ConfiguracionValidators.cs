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

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("El email del negocio no es válido.")
            .MaximumLength(120)
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.DiasAtencion)
            .MaximumLength(4000)
            .When(x => !string.IsNullOrWhiteSpace(x.DiasAtencion));

        RuleFor(x => x.HorarioApertura)
            .Matches("^([01]\\d|2[0-3]):[0-5]\\d$")
            .WithMessage("El horario de apertura debe tener formato HH:mm.")
            .MaximumLength(10)
            .When(x => !string.IsNullOrWhiteSpace(x.HorarioApertura));

        RuleFor(x => x.HorarioCierre)
            .Matches("^([01]\\d|2[0-3]):[0-5]\\d$")
            .WithMessage("El horario de cierre debe tener formato HH:mm.")
            .MaximumLength(10)
            .When(x => !string.IsNullOrWhiteSpace(x.HorarioCierre));

        RuleFor(x => x.LogoUrl)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.LogoUrl));

        RuleFor(x => x.ColorPrincipal)
            .NotEmpty()
            .Matches("^#[0-9a-fA-F]{6}$")
            .WithMessage("El color principal debe ser un hexadecimal válido.");

        RuleFor(x => x.DescuentoMaximoPermitido)
            .InclusiveBetween(0, 100)
            .WithMessage("El descuento máximo debe estar entre 0 y 100.");

        RuleFor(x => x.RedondeoTotal)
            .Must(BeValidRedondeo)
            .WithMessage("El redondeo debe ser 0, 0.05 o 1.00.");

        RuleFor(x => x.MontoMinimoAperturaCaja)
            .GreaterThanOrEqualTo(0)
            .WithMessage("El monto mínimo de apertura no puede ser negativo.");

        RuleFor(x => x.FormatoFecha)
            .Must(BeValidFormatoFecha)
            .WithMessage("El formato de fecha no es válido.");

        RuleFor(x => x.FormatoHora)
            .Must(BeValidFormatoHora)
            .WithMessage("El formato de hora no es válido.");
    }

    private static bool BeValidRedondeo(string? value)
    {
        return value is "0" or "0.05" or "1.00";
    }

    private static bool BeValidFormatoFecha(string? value)
    {
        return value is "dd/MM/yyyy" or "MM/dd/yyyy" or "yyyy-MM-dd";
    }

    private static bool BeValidFormatoHora(string? value)
    {
        return value is "24" or "12";
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

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("El email del negocio no es válido.")
            .MaximumLength(120)
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.DiasAtencion)
            .MaximumLength(4000)
            .When(x => !string.IsNullOrWhiteSpace(x.DiasAtencion));

        RuleFor(x => x.HorarioApertura)
            .Matches("^([01]\\d|2[0-3]):[0-5]\\d$")
            .WithMessage("El horario de apertura debe tener formato HH:mm.")
            .MaximumLength(10)
            .When(x => !string.IsNullOrWhiteSpace(x.HorarioApertura));

        RuleFor(x => x.HorarioCierre)
            .Matches("^([01]\\d|2[0-3]):[0-5]\\d$")
            .WithMessage("El horario de cierre debe tener formato HH:mm.")
            .MaximumLength(10)
            .When(x => !string.IsNullOrWhiteSpace(x.HorarioCierre));

        RuleFor(x => x.LogoUrl)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.LogoUrl));

        RuleFor(x => x.ColorPrincipal)
            .NotEmpty()
            .Matches("^#[0-9a-fA-F]{6}$")
            .WithMessage("El color principal debe ser un hexadecimal válido.");

        RuleFor(x => x.DescuentoMaximoPermitido)
            .InclusiveBetween(0, 100)
            .WithMessage("El descuento máximo debe estar entre 0 y 100.");

        RuleFor(x => x.RedondeoTotal)
            .Must(BeValidRedondeo)
            .WithMessage("El redondeo debe ser 0, 0.05 o 1.00.");

        RuleFor(x => x.MontoMinimoAperturaCaja)
            .GreaterThanOrEqualTo(0)
            .WithMessage("El monto mínimo de apertura no puede ser negativo.");

        RuleFor(x => x.FormatoFecha)
            .Must(BeValidFormatoFecha)
            .WithMessage("El formato de fecha no es válido.");

        RuleFor(x => x.FormatoHora)
            .Must(BeValidFormatoHora)
            .WithMessage("El formato de hora no es válido.");
    }

    private static bool BeValidRedondeo(string? value)
    {
        return value is "0" or "0.05" or "1.00";
    }

    private static bool BeValidFormatoFecha(string? value)
    {
        return value is "dd/MM/yyyy" or "MM/dd/yyyy" or "yyyy-MM-dd";
    }

    private static bool BeValidFormatoHora(string? value)
    {
        return value is "24" or "12";
    }
}
