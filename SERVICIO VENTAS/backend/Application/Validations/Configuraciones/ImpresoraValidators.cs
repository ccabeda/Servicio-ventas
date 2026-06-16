using FluentValidation;
using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.Validations.Configuraciones;

public class CreateImpresoraDtoValidator : AbstractValidator<CreateImpresoraDto>
{
    public CreateImpresoraDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la impresora es obligatorio.")
            .MaximumLength(120);

        RuleFor(x => x.NombreSistema)
            .NotEmpty().WithMessage("La impresora de Windows es obligatoria.")
            .MaximumLength(180);

        RuleFor(x => x.Modelo).MaximumLength(120);
        RuleFor(x => x.Conexion).MaximumLength(80);
        RuleFor(x => x.Puerto).MaximumLength(80);

        RuleFor(x => x.Tipo)
            .Must(value => value is "Ticket" or "Informes" or "Cocina")
            .WithMessage("El tipo de impresora no es válido.");

        RuleFor(x => x.AnchoPapelMm)
            .InclusiveBetween(40, 120)
            .WithMessage("El ancho de papel debe estar entre 40 y 120 mm.");

        RuleFor(x => x.DensidadImpresion)
            .Must(value => value is "Baja" or "Media" or "Alta")
            .WithMessage("La densidad de impresión no es válida.");
    }
}

public class UpdateImpresoraDtoValidator : AbstractValidator<UpdateImpresoraDto>
{
    public UpdateImpresoraDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la impresora es obligatorio.")
            .MaximumLength(120);

        RuleFor(x => x.NombreSistema)
            .NotEmpty().WithMessage("La impresora de Windows es obligatoria.")
            .MaximumLength(180);

        RuleFor(x => x.Modelo).MaximumLength(120);
        RuleFor(x => x.Conexion).MaximumLength(80);
        RuleFor(x => x.Puerto).MaximumLength(80);

        RuleFor(x => x.Tipo)
            .Must(value => value is "Ticket" or "Informes" or "Cocina")
            .WithMessage("El tipo de impresora no es válido.");

        RuleFor(x => x.AnchoPapelMm)
            .InclusiveBetween(40, 120)
            .WithMessage("El ancho de papel debe estar entre 40 y 120 mm.");

        RuleFor(x => x.DensidadImpresion)
            .Must(value => value is "Baja" or "Media" or "Alta")
            .WithMessage("La densidad de impresión no es válida.");
    }
}
