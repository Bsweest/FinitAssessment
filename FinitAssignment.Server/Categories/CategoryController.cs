using FinitAssignment.Server.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinitAssignment.Server.Categories;

public static class CategoryController
{
    public static IAsyncEnumerable<CategoryDto> QueryAllAsync(
        [FromServices] ProductCatalogDbContext dbContext
    )
    {
        return dbContext
            .Categories.Select(cat => new CategoryDto
            {
                Id = cat.Id,
                Name = cat.Name,
                Description = cat.Description,
                DisplayOrder = cat.DisplayOrder,
                IsActive = cat.IsActive,
                ParentId = cat.ParentId,
                CreatedAt = cat.CreatedAt,
                UpdatedAt = cat.UpdatedAt,
            })
            .AsAsyncEnumerable();
    }

    public static async Task<CategoryDto> GetAsync(
        int id,
        [FromServices] ProductCatalogDbContext dbContext
    )
    {
        return await dbContext
                .Categories.Select(cat => new CategoryDto
                {
                    Id = cat.Id,
                    Name = cat.Name,
                    Description = cat.Description,
                    DisplayOrder = cat.DisplayOrder,
                    IsActive = cat.IsActive,
                    ParentId = cat.ParentId,
                    CreatedAt = cat.CreatedAt,
                    UpdatedAt = cat.UpdatedAt,
                })
                .FirstOrDefaultAsync(cat => cat.Id == id)
            ?? throw new BussinessException($"Could not find category with id {id}");
    }

    public static async Task CreateAsync(
        [FromBody] CreateUpdateCategoryDto data,
        [FromServices] ProductCatalogDbContext dbContext,
        CancellationToken ct
    )
    {
        dbContext.Categories.Add(
            new Category
            {
                Name = data.Name,
                Description = data.Description,
                DisplayOrder = data.DisplayOrder,
                IsActive = data.IsActive,
                ParentId = data.ParentId,
            }
        );

        await dbContext.SaveChangesAsync(ct);
    }

    public static async Task UpdateAsync(
        int id,
        [FromBody] CreateUpdateCategoryDto data,
        [FromServices] ProductCatalogDbContext dbContext,
        CancellationToken ct
    )
    {
        var cat =
            await dbContext.Categories.FirstOrDefaultAsync(e => e.Id == id, cancellationToken: ct)
            ?? throw new BussinessException($"Could not find category with id {id}");

        cat.Name = data.Name;
        cat.Description = data.Description;
        cat.DisplayOrder = data.DisplayOrder;
        cat.IsActive = data.IsActive;
        cat.ParentId = data.ParentId;

        await dbContext.SaveChangesAsync(ct);
    }
}
