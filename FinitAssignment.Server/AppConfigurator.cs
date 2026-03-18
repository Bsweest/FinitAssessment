using FinitAssignment.Server.EntityFrameworkCore;
using Serilog;

namespace FinitAssignment.Server;

public static class AppConfigurator
{
    public static IServiceCollection ConfigureServices(IServiceCollection services, IConfigurationManager configuration)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddSerilog();
        services.AddSqlServer<ProductCatalogDbContext>(configuration.GetConnectionString("Default"));


        return services;
    }

    public static WebApplication MapEndpoints(WebApplication app)
    {

        return app;
    }
}
