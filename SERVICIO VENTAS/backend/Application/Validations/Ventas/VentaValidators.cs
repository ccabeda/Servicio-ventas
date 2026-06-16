using FluentValidation;
using ServicioVentas.Application.DTOs.Ventas;

namespace ServicioVentas.Application.Validations.Ventas;

public class CreateVentaDetalleDtoValidator : AbstractValidator<CreateVentaDetalleDto>
{
    public CreateVentaDetalleDtoValidator()
    {
        RuleFor(x => x.ProductoId)
            .GreaterThan(0);

        RuleFor(x => x.Cantidad)
            .GreaterThan(0).WithMessage("Las cantidades deben ser mayores a cero.")
            .Must(BeWholeNumber).WithMessage("Las cantidades deben ser números enteros.");
    }

    private static bool BeWholeNumber(decimal value) => decimal.Truncate(value) == value;
}

public class CreateVentaDtoValidator : AbstractValidator<CreateVentaDto>
{
    public CreateVentaDtoValidator()
    {
        RuleFor(x => x.MedioPagoId)
            .GreaterThan(0);

        RuleFor(x => x.UsuarioId)
            .GreaterThan(0);

        RuleFor(x => x.Descuento)
            .GreaterThanOrEqualTo(0);
        RuleFor(x => x.Descuento)
            .LessThanOrEqualTo(100)
            .WithMessage("El descuento debe ser un porcentaje entre 0 y 100.");

        RuleFor(x => x.Recargo)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Detalles)
            .NotEmpty().WithMessage("La venta debe tener al menos un producto.");

        RuleForEach(x => x.Detalles)
            .SetValidator(new CreateVentaDetalleDtoValidator());

        RuleFor(x => x.Observaciones)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.Observaciones));
    }
}
