namespace FinitAssignment.Server;

public interface ISoftDelete
{
    DateTimeOffset? DeletedAt { get; set; }
}
