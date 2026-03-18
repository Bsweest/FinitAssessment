namespace FinitAssignment.Server.Categories;

public class CreateUpdateCategoryDto
{
    public required string Name { get; init; }

    public required string Description { get; init; }

    public required bool IsActive { get; init; }

    public required int DisplayOrder { get; init; }

    public required int? ParentId { get; init; }
}
