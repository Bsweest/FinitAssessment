namespace FinitAssignment.Server;

public class RequestContext
{
    public DateTimeOffset StartedAt { get; } = DateTimeOffset.UtcNow;
}
