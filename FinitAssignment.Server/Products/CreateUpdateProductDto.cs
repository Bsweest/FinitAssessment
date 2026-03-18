namespace FinitAssignment.Server.Products;

public class CreateUpdateProductDto
{

    public required string Name { get; init; }

    public required string Description { get; init; }

    public required decimal Price { get; init; }

    public required IFormFile? Image { get; init; }

    public required int? CategoryId { get; init; }

    public required string CustomAttributes { get; init; }
}
