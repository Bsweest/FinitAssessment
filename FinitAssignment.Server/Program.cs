using FinitAssignment.Server;
using Serilog;

// I anticipate this little project will take about 3, 4 hours, but that is not realistic with all the requirements.
// I'm not ready to spend more time so I can only scaffold the project structure and show you my understanding of the technologies and my skill sets with some examples.
// If you are satisfied with this, I would love an opportunity to discuss more about my technical background
// But if you don't think the assessment is done, send me an email and I will try to finish the work

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
