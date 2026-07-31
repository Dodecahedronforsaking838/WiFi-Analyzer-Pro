import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "0.75rem",
  padding: "10px 14px",
};

export default function SpeedHistoryChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Download vs Upload (12h)</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9ca3af" }} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
            <Line
              type="monotone"
              dataKey="download"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3, fill: "#6366f1" }}
              activeDot={{ r: 5 }}
              name="Download (Mbps)"
            />
            <Line
              type="monotone"
              dataKey="upload"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22d3ee" }}
              activeDot={{ r: 5 }}
              name="Upload (Mbps)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
