using System.Net;

namespace FinitAssignment.Server;

public class BussinessException(string message) : Exception(message)
{
    public HttpStatusCode StatusCode { get; init; } = HttpStatusCode.BadRequest;
}
