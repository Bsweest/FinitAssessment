using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace FinitAssignment.Server.EntityFrameworkCore;

public class AuditInterceptor(RequestContext requestContext) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        if (eventData.Context is not { } dbContext)
            return base.SavingChangesAsync(eventData, result, cancellationToken);



        foreach (var entry in dbContext.ChangeTracker.Entries<IAuditable>())
        {
            var entity = entry.Entity;
            switch (entry.State)
            {
                case EntityState.Added:
                    entity.CreatedAt = requestContext.StartedAt;
                    break;
                case EntityState.Modified:
                    entity.UpdatedAt = requestContext.StartedAt;
                    break;
                case EntityState.Deleted:
                case EntityState.Unchanged:
                case EntityState.Detached:
                default:
                    break;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}