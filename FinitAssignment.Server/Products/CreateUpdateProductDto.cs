using Microsoft.AspNetCore.Mvc;

namespace FinitAssignment.Products;

public class CreateUpdateProductDto
{
    [FromForm(Name = "name")]
    public required string Name { get; init; }

    [FromForm(Name = "description")]
    public required string Description { get; init; }

    [FromForm(Name = "price")]
    public required decimal Price { get; init; }

    [FromForm(Name = "imagePath")]
    public required string? ImagePath { get; init; }

    public required IFormFile? Image { get; init; }

    [FromForm(Name = "categoryId")]
    public required int? CategoryId { get; init; }

    [FromForm(Name = "customAttributes")]
    public required string CustomAttributes { get; init; }
}
