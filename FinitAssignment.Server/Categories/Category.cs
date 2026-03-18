namespace FinitAssignment.Server.Categories;

public class Category : IAuditable, ISoftDelete
{
    public int Id { get; protected init; }

    public required string Name { get; set; }

    public required string Description { get; set; }

    public Category? Parent { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }
}
