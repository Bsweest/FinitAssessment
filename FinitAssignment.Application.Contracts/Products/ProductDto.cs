using FinitAssignment.Categories;

namespace FinitAssignment.Products;

public class ProductDto
{
    public required int Id { get; init; }

    public required string Name { get; init; }

    public required string Description { get; init; }

    public required decimal Price { get; init; }

    public required string? ImagePath { get; init; }

    public required CategoryDto? Category { get; init; }

    public required string CustomAttributes { get; init; }

    public required DateTimeOffset CreatedAt { get; init; }

    public required DateTimeOffset? UpdatedAt { get; init; }
}
