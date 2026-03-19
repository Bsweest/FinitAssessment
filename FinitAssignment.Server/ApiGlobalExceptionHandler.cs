using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mime;
using System.Text.Json;

namespace FinitAssignment;

public class ApiGlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var message = exception.Message;
        var status = exception switch
        {
            BussinessException businessException => businessException.StatusCode,
            DbUpdateException => HttpStatusCode.FailedDependency,
            _ => HttpStatusCode.InternalServerError,
        };

        httpContext.Response.StatusCode = (int)status;
        httpContext.Response.ContentType = MediaTypeNames.Application.Json;
        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(
                new
                {
                    Error = new
                    {
                        Message = message,
                        Detail = exception.ToString(),
                    },
                }
            ),
            cancellationToken
        );

        return true;

    }
}
