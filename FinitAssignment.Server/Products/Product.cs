using System.Diagnostics.CodeAnalysis;

namespace FinitAssignment.Server.Products;

public class Product : IAuditable, ISoftDelete
{
    public int Id { get; protected init; }

    public required string Name { get; set; }

    public required string Description { get; set; }

    public required string Price { get; set; }

    public required string ImagePath { get; set; }

    [StringSyntax(StringSyntaxAttribute.Json)]
    public string CustomAttribute { get; set; } = "{}";

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }
}
