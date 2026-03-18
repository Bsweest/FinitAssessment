using FinitAssignment.Server.Extensions;

namespace FinitAssignment.Server.Categories;

public class Category : IAuditable
{
    private string _name = string.Empty;

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

    public required string Description { get; set; }

    public int? ParentId { get; set; }
    public Category? Parent { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
}
