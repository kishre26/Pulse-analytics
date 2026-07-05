import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import StatCard from "../components/StatCard.jsx";
import LineChartCard from "../components/LineChartCard.jsx";
import BarListCard from "../components/BarListCard.jsx";
import TrackingSnippet from "../components/TrackingSnippet.jsx";

const RANGES = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

export default function SiteDashboard() {
  const { siteId } = useParams();
  const [range, setRange] = useState("7d");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    client.get(`/stats/${siteId}/summary`, { params: { range } }).then(({ data }) => {
      if (!ignore) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [siteId, range]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pulse animate-blip" />
          <span className="font-display font-semibold text-lg tracking-tight">pulse</span>
        </Link>
        <Link to="/" className="text-sm text-muted hover:text-text transition-colors">
          ← All sites
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display text-2xl font-semibold">Site overview</h1>
          <div className="flex gap-1.5 bg-surface border border-line rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                  range === r.key ? "bg-pulse text-ink" : "text-muted hover:text-text"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading || !stats ? (
          <p className="text-muted text-sm">Loading stats…</p>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <StatCard label="Pageviews" value={stats.pageviews.toLocaleString()} accent />
              <StatCard label="Unique visitors" value={stats.uniqueVisitors.toLocaleString()} />
            </div>

            <LineChartCard data={stats.timeseries} />

            <div className="grid sm:grid-cols-2 gap-4">
              <BarListCard
                title="Top pages"
                rows={stats.topPages}
                labelKey="path"
                valueKey="views"
              />
              <BarListCard
                title="Top referrers"
                rows={stats.topReferrers}
                labelKey="referrer"
                valueKey="visits"
              />
              <BarListCard
                title="Browsers"
                rows={stats.browsers}
                labelKey="browser"
                valueKey="count"
              />
              <BarListCard
                title="Devices"
                rows={stats.devices}
                labelKey="device"
                valueKey="count"
              />
            </div>

            <TrackingSnippet siteId={siteId} />
          </div>
        )}
      </main>
    </div>
  );
}
