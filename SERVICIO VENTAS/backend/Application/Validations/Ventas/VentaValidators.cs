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
            .GreaterThan(0).WithMessage("Las cantidades deben ser mayores a cero.");
    }
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
