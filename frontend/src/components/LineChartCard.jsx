import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function LineChartCard({ data }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-5 h-80">
      <p className="text-xs text-muted uppercase tracking-wide mb-4">Traffic over time</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#262D38" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#8B96A5"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#8B96A5" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#161B22",
              border: "1px solid #262D38",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#E6EDF3" }}
          />
          <Line
            type="monotone"
            dataKey="pageviews"
            stroke="#5EEAD4"
            strokeWidth={2}
            dot={false}
            name="Pageviews"
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#F5A623"
            strokeWidth={2}
            dot={false}
            name="Visitors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
