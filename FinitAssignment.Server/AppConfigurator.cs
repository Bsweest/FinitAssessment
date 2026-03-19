using FinitAssignment.Categories;
using FinitAssignment.EntityFrameworkCore;
using FinitAssignment.HostedServices;
using FinitAssignment.Products;
using Serilog;

namespace FinitAssignment;

public static class AppConfigurator
{
    public static IServiceCollection ConfigureServices(
        IServiceCollection services,
        IConfigurationManager configuration
    )
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SupportNonNullableReferenceTypes();
        });
        services.AddSerilog();
        services.AddSqlServer<ProductCatalogDbContext>(
            configuration.GetConnectionString("Default")
        );
        services.AddProblemDetails().AddExceptionHandler<ApiGlobalExceptionHandler>();
        services.AddHostedService<SeedDataHost>();

        services.AddSingleton<IFileProvider, LocalFileProvider>();

        return services;
    }

    public static WebApplication MapEndpoints(WebApplication app)
    {
        var productsEndpont = app.MapGroup("/api/products");
        productsEndpont.MapGet("/", ProductController.QueryAsync).WithName("Query Products");
        productsEndpont.MapPost("/", ProductController.CreateAsync)
            .DisableAntiforgery()
            .WithName("Create Product");
        productsEndpont.MapPatch("/{id}", ProductController.UpdateAsync)
            .DisableAntiforgery()
            .WithName("Update Product");
        productsEndpont.MapDelete("/{id}", ProductController.DeleteAsync).WithName("Delete Product");
        productsEndpont.MapGet("/{id}", ProductController.GetAsync).WithName("Get Product");

        var categoriesEndpoint = app.MapGroup("/api/categories");
        categoriesEndpoint.MapGet("/", CategoryController.QueryAllAsync).WithName("Query Categories");
        categoriesEndpoint.MapPost("/", CategoryController.CreateAsync).WithName("Create Category");
        categoriesEndpoint.MapPatch("/{id}", CategoryController.UpdateAsync).WithName("Update Category");
        categoriesEndpoint.MapGet("/{id}", CategoryController.GetAsync).WithName("Get Category");

        return app;
    }
}
