import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function RevenueChart({ data }) {

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[320px] text-gray-400">
        No Data
      </div>
    );
  }

  // Detect correct key
  const valueKey = data[0]?.revenue ? "revenue" : "orders";

  return (
    <div className="w-full min-h-[320px]">

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={data[0]?.month ? "month" : "day"} />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey={valueKey}
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}