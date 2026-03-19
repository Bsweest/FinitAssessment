using FinitAssignment.Categories;
using FinitAssignment.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace FinitAssignment.EntityFrameworkCore;

public class ProductCatalogDbContext(
    DbContextOptions<ProductCatalogDbContext> options,
    IEnumerable<IInterceptor> interceptors
) : DbContext(options)
{
    public DbSet<Product> Products { get; init; }

    public DbSet<Category> Categories { get; init; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder.AddInterceptors(interceptors));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>(b =>
        {
            b.Property(e => e.CustomAttributes).HasColumnType("nvarchar(max)");
            b.Property(e => e.Price).HasColumnType("decimal(18,2)");
            b.HasQueryFilter(e => e.DeletedAt == null);
        });
        modelBuilder.Entity<Category>(b =>
        {
            b.HasIndex(e => e.Name).IsUnique();
        });
    }
}
