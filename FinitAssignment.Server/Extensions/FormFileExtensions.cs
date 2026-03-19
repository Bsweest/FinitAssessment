using System.Net.Mime;

namespace FinitAssignment.Extensions;

public static class FormFileExtensions
{
    private static readonly string[] AllowedMimeTypes = new[]
    {
        MediaTypeNames.Image.Gif,
        MediaTypeNames.Image.Webp,
        MediaTypeNames.Image.Tiff,
        MediaTypeNames.Image.Avif,
        MediaTypeNames.Image.Icon,
        MediaTypeNames.Image.Bmp,
        MediaTypeNames.Image.Jpeg,
        MediaTypeNames.Image.Png,
        MediaTypeNames.Image.Svg,
    };

    public static bool IsImage(this IFormFile file, out string extension)
    {
        if (!AllowedMimeTypes.Contains(file.ContentType.ToLower()))
        {
            extension = string.Empty;
            return false;
        }

        extension = Path.GetExtension(file.FileName).ToLower();
        return true;
    }
}
