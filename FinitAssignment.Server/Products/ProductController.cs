using FinitAssignment.Server.Categories;
using FinitAssignment.Server.EntityFrameworkCore;
using FinitAssignment.Server.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FinitAssignment.Server.Products;

public static class ProductController
{
    private static readonly Expression<Func<Product, ProductDto>> MapToDto =
        static product => new ProductDto
        {
            Id = product.Id,
            CustomAttributes = product.CustomAttributes,
            Category =
                product.Category == null
                    ? null
                    : new CategoryDto
                    {
                        Id = product.Category.Id,
                        Name = product.Category.Name,
                        Description = product.Category.Description,
                        DisplayOrder = product.Category.DisplayOrder,
                        IsActive = product.Category.IsActive,
                        ParentId = product.Category.ParentId,
                        CreatedAt = product.Category.CreatedAt,
                        UpdatedAt = product.Category.UpdatedAt,
                    },
            Description = product.Description,
            ImagePath = product.ImagePath,
            Name = product.Name,
            Price = product.Price,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
        };

    public static IAsyncEnumerable<ProductDto> QueryAsync(
        [FromQuery] int? page,
        [FromQuery] string? name,
        [FromQuery] string? description,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? customAttributes,
        [FromQuery] string? category,
        [FromServices] ProductCatalogDbContext dbContext
    )
    {
        var skip = (page ?? 1) - 1;

        IQueryable<Product> products = dbContext.Products;

        if (name is not null)
        {
            products = products.Where(product =>
                product.NormalizedName.Contains(name.ToNormalized())
            );
        }
        if (description is not null)
        {
            products = products.Where(product =>
                product.NormalizedDescription.Contains(description.ToNormalized())
            );
        }
        if (minPrice is not null)
        {
            products = products.Where(product => product.Price >= minPrice);
        }
        if (maxPrice is not null)
        {
            products = products.Where(product => product.Price <= maxPrice);
        }
        if (customAttributes is not null)
        {
            products = products.Where(product =>
                product.CustomAttributes.Contains(customAttributes)
            );
        }
        if (category is not null)
        {
            products = products.Where(product =>
                product.Category != null
                && product.Category.NormalizedName.Contains(category.ToNormalized())
            );
        }

        return products.Select(MapToDto)
            .Take(24)
            .Skip(skip)
            .AsAsyncEnumerable();
    }

    public static async Task<ProductDto> GetAsync(
        int id,
        [FromServices] ProductCatalogDbContext dbContext,
        CancellationToken ct
    )
    {
        return await dbContext
                .Products.Where(e => e.Id == id)
                .Select(MapToDto)
                .FirstOrDefaultAsync(cancellationToken: ct)
            ?? throw new BussinessException($"Could not find product with id {id}");
    }

    public static async Task UpdateAsync(
        int id,
        [FromForm] CreateUpdateProductDto data,
        IFileProvider fileProvider,
        [FromServices] ProductCatalogDbContext dbContext,
        CancellationToken ct
    )
    {
        var product =
            await dbContext.Products.FirstOrDefaultAsync(e => e.Id == id, cancellationToken: ct)
            ?? throw new BussinessException($"Could not find product with id {id}");

        product.Name = data.Name;
        product.Description = data.Description;
        product.Price = data.Price;
        product.Category =
            await dbContext.Categories.FirstOrDefaultAsync(
                e => e.Id == data.CategoryId,
                cancellationToken: ct
            ) ?? throw new BussinessException($"Could not find category with id {data.CategoryId}");

        product.CustomAttributes = data.CustomAttributes;

        if (data.Image is { } image)
        {
            if (!image.IsImage(out var ext))
                throw new BussinessException("Uploaded file is not an image");

            var path = $"/file-storage/products/{id}/packshot.{ext}";
            await fileProvider.SaveAsync(image, path, ct);
            product.ImagePath = path;
        }

        await dbContext.SaveChangesAsync(ct);
    }

    public static async Task CreateAsync(
        [FromForm] CreateUpdateProductDto data,
        IFileProvider fileProvider,
        [FromServices] ProductCatalogDbContext dbContext,
        CancellationToken ct
    )
    {
        var product = dbContext
            .Products.Add(
                new Product
                {
                    Name = data.Name,
                    Description = data.Description,
                    Price = data.Price,
                    ImagePath = null,
                    CustomAttributes = data.CustomAttributes,
                    Category =
                        data.CategoryId == null
                            ? null
                            : await dbContext.Categories.FirstOrDefaultAsync(
                                e => e.Id == data.CategoryId,
                                cancellationToken: ct
                            )
                                ?? throw new BussinessException(
                                    $"Could not find category with id {data.CategoryId}"
                                ),
                }
            )
            .Entity;

        if (data.Image is { } image)
        {
            if (!image.IsImage(out var ext))
                throw new BussinessException("Uploaded file is not an image");

            var path = $"/file-storage/products/{product.Id}/packshot.{ext}";
            await fileProvider.SaveAsync(image, path, ct);
            product.ImagePath = path;
        }

        await dbContext.SaveChangesAsync(ct);
    }

    public static async Task DeleteAsync(
        int id,
      [FromServices] ProductCatalogDbContext dbContext,
      CancellationToken ct
  )
    {
        var product =
           await dbContext.Products.FirstOrDefaultAsync(e => e.Id == id, cancellationToken: ct)
           ?? throw new BussinessException($"Could not find product with id {id}");

        dbContext.Products.Remove(product);
        await dbContext.SaveChangesAsync(ct);
    }
}
