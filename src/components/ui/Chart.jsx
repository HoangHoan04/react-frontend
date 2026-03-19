import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

// Tooltip tùy chỉnh
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-2 rounded-lg shadow border ${
          isDark
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-200"
        }`}
      >
        <p className="font-semibold">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Chart({
  type = "line",
  data = [],
  isDark = false,
  dataKey = "value",
  nameKey = "name",
  small = false,
}) {
  const height = small ? 140 : 300;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <ResponsiveContainer width="100%" height={height}>
        {type === "line" && (
          <LineChart data={data}>
            <XAxis dataKey={nameKey} hide={small} />
            <YAxis hide={small} />
            {!small && <Legend />}
            {!small && <Tooltip content={<CustomTooltip isDark={isDark} />} />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={small ? 1.5 : 2}
              dot={!small}
            />
          </LineChart>
        )}

        {type === "bar" && (
          <BarChart data={data}>
            <XAxis dataKey={nameKey} hide={small} />
            <YAxis hide={small} />
            {!small && <Legend />}
            {!small && <Tooltip content={<CustomTooltip isDark={isDark} />} />}
            <Bar
              dataKey={dataKey}
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              barSize={small ? 20 : 40}
            />
          </BarChart>
        )}

        {type === "pie" && (
          <PieChart>
            {!small && <Legend />}
            {!small && <Tooltip content={<CustomTooltip isDark={isDark} />} />}
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={small ? 50 : 110}
              innerRadius={small ? 0 : 40}
              label={!small}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
