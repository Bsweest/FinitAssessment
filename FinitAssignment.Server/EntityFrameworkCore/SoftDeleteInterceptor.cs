using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace FinitAssignment.Server.EntityFrameworkCore;

public class SoftDeleteInterceptor(RequestContext requestContext) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        if (eventData.Context is not { } dbContext)
            return base.SavingChangesAsync(eventData, result, cancellationToken);


        foreach (var entry in dbContext.ChangeTracker.Entries<ISoftDelete>())
        {
            var entity = entry.Entity;
            switch (entry.State)
            {
                case EntityState.Deleted:
                    entity.DeletedAt = requestContext.StartedAt;
                    break;
                case EntityState.Added:
                case EntityState.Modified:
                case EntityState.Unchanged:
                case EntityState.Detached:
                default:
                    break;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}