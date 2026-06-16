using FluentValidation;
using ServicioVentas.Application.DTOs.Productos;

namespace ServicioVentas.Application.Validations.Productos;

public class CreateCategoriaProductoDtoValidator : AbstractValidator<CreateCategoriaProductoDto>
{
    public CreateCategoriaProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la categoría es obligatorio.")
            .MaximumLength(100);

        RuleFor(x => x.Icono)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.Icono));

        RuleFor(x => x.Color)
            .MaximumLength(20)
            .When(x => !string.IsNullOrWhiteSpace(x.Color));
    }
}

public class UpdateCategoriaProductoDtoValidator : AbstractValidator<UpdateCategoriaProductoDto>
{
    public UpdateCategoriaProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la categoría es obligatorio.")
            .MaximumLength(100);

        RuleFor(x => x.Icono)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.Icono));

        RuleFor(x => x.Color)
            .MaximumLength(20)
            .When(x => !string.IsNullOrWhiteSpace(x.Color));
    }
}

public class CreateMarcaProductoDtoValidator : AbstractValidator<CreateMarcaProductoDto>
{
    public CreateMarcaProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la marca es obligatorio.")
            .MaximumLength(100);
    }
}

public class UpdateMarcaProductoDtoValidator : AbstractValidator<UpdateMarcaProductoDto>
{
    public UpdateMarcaProductoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre de la marca es obligatorio.")
            .MaximumLength(100);
    }
}
