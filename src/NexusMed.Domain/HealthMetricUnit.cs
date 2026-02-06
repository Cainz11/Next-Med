namespace NexusMed.Domain;

/// <summary>
/// Unidades permitidas para métricas de saúde, evitando registros inconsistentes.
/// O valor gravado no banco é a string de exibição (ex: "mg/dL", "kg").
/// </summary>
public enum HealthMetricUnit
{
    /// <summary>Sem unidade (valor livre ou não aplicável)</summary>
    Nenhuma = 0,

    /// <summary>Miligramas por decilitro (glicemia)</summary>
    MgDl,

    /// <summary>Milímetros de mercúrio (pressão arterial)</summary>
    MmHg,

    /// <summary>Quilogramas (peso)</summary>
    Kg,

    /// <summary>Minutos (atividade física, duração)</summary>
    Min,

    /// <summary>Quilocalorias (gasto energético)</summary>
    Kcal,

    /// <summary>Batimentos por minuto (frequência cardíaca)</summary>
    Bpm,
}

/// <summary>
/// Mapeamento entre enum e string armazenada/exibida na API e no frontend.
/// </summary>
public static class HealthMetricUnitExtensions
{
    private static readonly Dictionary<HealthMetricUnit, string> ToStringMap = new()
    {
        { HealthMetricUnit.Nenhuma, "" },
        { HealthMetricUnit.MgDl, "mg/dL" },
        { HealthMetricUnit.MmHg, "mmHg" },
        { HealthMetricUnit.Kg, "kg" },
        { HealthMetricUnit.Min, "min" },
        { HealthMetricUnit.Kcal, "kcal" },
        { HealthMetricUnit.Bpm, "bpm" },
    };

    private static readonly Dictionary<string, HealthMetricUnit> FromStringMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "", HealthMetricUnit.Nenhuma },
        { "mg/dL", HealthMetricUnit.MgDl },
        { "mmHg", HealthMetricUnit.MmHg },
        { "kg", HealthMetricUnit.Kg },
        { "min", HealthMetricUnit.Min },
        { "kcal", HealthMetricUnit.Kcal },
        { "bpm", HealthMetricUnit.Bpm },
    };

    public static string ToUnitString(this HealthMetricUnit unit) => ToStringMap.TryGetValue(unit, out var s) ? s : "";

    public static bool TryParseUnit(string? value, out HealthMetricUnit unit)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            unit = HealthMetricUnit.Nenhuma;
            return true;
        }
        return FromStringMap.TryGetValue(value.Trim(), out unit);
    }

    /// <summary>Lista de unidades para dropdown: (valor para API/banco, rótulo para exibição).</summary>
    public static IReadOnlyList<(string Value, string Label)> GetAllUnitsForDropdown()
    {
        return ToStringMap
            .Where(kv => kv.Key != HealthMetricUnit.Nenhuma)
            .Select(kv => (kv.Value, kv.Value))
            .ToList();
    }
}
