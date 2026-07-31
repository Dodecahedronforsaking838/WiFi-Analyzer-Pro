import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "0.75rem",
  padding: "10px 14px",
};

export default function PingHistoryChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Ping Latency (12h)</h3>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9ca3af" }} />
            <Bar
              dataKey="ping"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              name="Ping (ms)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
