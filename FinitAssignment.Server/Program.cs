using FinitAssignment;
using Serilog;

Log.Logger = new LoggerConfiguration()
#if DEBUG
    .MinimumLevel.Debug()
#else
    .MinimumLevel.Information()
#endif
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Async(configure =>
        configure.File(
            "Logs/log.txt",
            rollingInterval: RollingInterval.Day,
            rollOnFileSizeLimit: true
        )
    )
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);
    AppConfigurator.ConfigureServices(builder.Services, builder.Configuration);

    Log.Information("Starting web application");

    var app = builder.Build();
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.UseExceptionHandler();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    AppConfigurator.MapEndpoints(app);
    app.MapFallbackToFile("/index.html");

    Log.Information("Application is running");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Something went wrong");
}
finally
{
    await Log.CloseAndFlushAsync();
}
