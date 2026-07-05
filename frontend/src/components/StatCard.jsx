export default function StatCard({ label, value, accent = false }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-xs text-muted uppercase tracking-wide mb-2">{label}</p>
      <p
        className={`font-mono text-3xl font-medium ${accent ? "text-pulse" : "text-text"}`}
      >
        {value}
      </p>
    </div>
  );
}
