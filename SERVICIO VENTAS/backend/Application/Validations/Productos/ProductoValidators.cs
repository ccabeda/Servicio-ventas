using FluentValidation;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Domain.Enums;

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
            .GreaterThanOrEqualTo(0).WithMessage("El stock no puede ser negativo.")
            .Must(ProductoValidationRules.BeWholeNumber).WithMessage("El stock debe ser un número entero.");

        RuleFor(x => x.CodigoBarra)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoBarra));

        RuleFor(x => x.CodigoInterno)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoInterno));

        RuleFor(x => x.CategoriaId)
            .GreaterThan(0)
            .When(x => x.CategoriaId.HasValue);

        RuleFor(x => x.MarcaId)
            .GreaterThan(0)
            .When(x => x.MarcaId.HasValue);
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

        RuleFor(x => x.CodigoBarra)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoBarra));

        RuleFor(x => x.CodigoInterno)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoInterno));

        RuleFor(x => x.CategoriaId)
            .GreaterThan(0)
            .When(x => x.CategoriaId.HasValue);

        RuleFor(x => x.MarcaId)
            .GreaterThan(0)
            .When(x => x.MarcaId.HasValue);
    }
}

public class AjustarStockProductoDtoValidator : AbstractValidator<AjustarStockProductoDto>
{
    public AjustarStockProductoDtoValidator()
    {
        RuleFor(x => x.Tipo)
            .Must(x => x is TipoMovimientoStock.Ingreso or TipoMovimientoStock.Salida or TipoMovimientoStock.Ajuste)
            .WithMessage("El tipo de movimiento de stock no es válido.");

        RuleFor(x => x.Cantidad)
            .GreaterThanOrEqualTo(0)
            .WithMessage("La cantidad no puede ser negativa.")
            .Must(ProductoValidationRules.BeWholeNumber).WithMessage("La cantidad debe ser un número entero.");

        RuleFor(x => x.Motivo)
            .NotEmpty().WithMessage("El motivo es obligatorio.")
            .MaximumLength(80);

        RuleFor(x => x.Observacion)
            .MaximumLength(250)
            .When(x => !string.IsNullOrWhiteSpace(x.Observacion));
    }

}

internal static class ProductoValidationRules
{
    public static bool BeWholeNumber(decimal value) => decimal.Truncate(value) == value;
}
