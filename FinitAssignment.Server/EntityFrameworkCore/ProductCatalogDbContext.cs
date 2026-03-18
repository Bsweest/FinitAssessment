using FinitAssignment.Server.Categories;
using FinitAssignment.Server.Extensions;
using FinitAssignment.Server.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace FinitAssignment.Server.EntityFrameworkCore;

public class ProductCatalogDbContext(
    DbContextOptions<ProductCatalogDbContext> options,
    IEnumerable<IInterceptor> interceptors
) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder.AddInterceptors(interceptors));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>(b =>
        {
            b.Property(e => e.CustomAttribute).HasColumnType("nvarchar(max)");
            b.DefaultQueryFilter();
        });
        modelBuilder.Entity<Category>(b =>
        {
            b.DefaultQueryFilter();
        });
    }
}
