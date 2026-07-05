export default function BarListCard({ title, rows, labelKey, valueKey }) {
  const max = Math.max(1, ...rows.map((r) => r[valueKey]));

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-xs text-muted uppercase tracking-wide mb-4">{title}</p>

      {rows.length === 0 ? (
        <p className="text-sm text-muted py-6 text-center">No data for this range yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((row, i) => (
            <li key={i} className="relative">
              <div
                className="absolute inset-y-0 left-0 bg-pulse/10 rounded"
                style={{ width: `${(row[valueKey] / max) * 100}%` }}
              />
              <div className="relative flex items-center justify-between px-2.5 py-1.5 text-sm">
                <span className="truncate pr-3">{row[labelKey]}</span>
                <span className="font-mono text-muted shrink-0">{row[valueKey]}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
