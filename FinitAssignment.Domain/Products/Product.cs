using FinitAssignment.Categories;
using FinitAssignment.Extensions;
using System.Diagnostics.CodeAnalysis;

namespace FinitAssignment.Products;

public class Product : IAuditable, ISoftDelete
{
    private string _name = string.Empty;
    private string _description = string.Empty;

    public int Id { get; protected init; }

    public required string Name
    {
        get => _name;
        set
        {
            _name = value;
            NormalizedName = _name.ToNormalized();
        }
    }

    public string NormalizedName { get; protected set; } = string.Empty;

    public required string Description
    {
        get => _description;
        set
        {
            _description = value;
            NormalizedDescription = _description.ToNormalized();
        }
    }

    public string NormalizedDescription { get; protected set; } = string.Empty;

    public required decimal Price { get; set; }

    public required string? ImagePath { get; set; }

    public required Category? Category { get; set; }

    [StringSyntax(StringSyntaxAttribute.Json)]
    public string CustomAttributes { get; set; } = "{}";

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }
}
