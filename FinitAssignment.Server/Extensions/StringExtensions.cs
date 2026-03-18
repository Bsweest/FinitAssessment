using System.Globalization;
using System.Text;

namespace FinitAssignment.Server.Extensions;

public static class StringExtensions
{
    public static string ToNormalized(this string text)
    {
        string normalized = text.Normalize(NormalizationForm.FormD);

        var sb = new StringBuilder();
        foreach (char c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        return sb.ToString().Normalize(NormalizationForm.FormC).ToUpperInvariant().Trim();
    }
}
