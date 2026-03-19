namespace FinitAssignment;

public interface IFileProvider
{
    Task SaveAsync(IFormFile file, string path, CancellationToken cancellationToken = default);
}

public class LocalFileProvider : IFileProvider
{
    private const string StoredOn = "wwwroot/";

    private static string AbsolutePath(params string[] paths)
    {
        var absolutePath = Path.Join([StoredOn, .. paths]);
        Directory.CreateDirectory(Path.GetDirectoryName(absolutePath)!);
        return absolutePath;
    }

    public async Task SaveAsync(IFormFile file, string path, CancellationToken cancellationToken = default)
    {
        var absolutePath = AbsolutePath(path);
        await using var fs = File.Create(absolutePath);
        await file.CopyToAsync(fs, cancellationToken);
    }
}
