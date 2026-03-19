using System.Net;

namespace FinitAssignment;

public class BussinessException(string message) : Exception(message)
{
    public HttpStatusCode StatusCode { get; init; } = HttpStatusCode.BadRequest;
}
