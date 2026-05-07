using FluentValidation;
using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.Validations.Productos;

public class CreateProductoDtoValidator : AbstractValidator<CreateProductoDto>
{
    public CreateProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del producto es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Precio)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Costo)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("El stock no puede ser negativo.");

        RuleFor(x => x.CodigoBarra)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoBarra));

        RuleFor(x => x.CodigoInterno)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoInterno));
    }
}

public class UpdateProductoDtoValidator : AbstractValidator<UpdateProductoDto>
{
    public UpdateProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del producto es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Precio)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Costo)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("El stock no puede ser negativo.");

        RuleFor(x => x.CodigoBarra)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoBarra));

        RuleFor(x => x.CodigoInterno)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoInterno));
    }
}
