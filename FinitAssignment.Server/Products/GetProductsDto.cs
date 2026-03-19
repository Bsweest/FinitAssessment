namespace FinitAssignment.Products;

public class GetProductsDto
{
    public required int Count { get; init; }

    public required IAsyncEnumerable<ProductDto> Items { get; init; }
}
