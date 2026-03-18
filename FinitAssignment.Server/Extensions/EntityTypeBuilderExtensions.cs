using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinitAssignment.Server.Extensions;

public static class EntityTypeBuilderExtensions
{
    public static EntityTypeBuilder<T> DefaultQueryFilter<T>(this EntityTypeBuilder<T> builder)
        where T : class, ISoftDelete
    {
        return builder.HasQueryFilter(e => e.DeletedAt == null);
    }
}
