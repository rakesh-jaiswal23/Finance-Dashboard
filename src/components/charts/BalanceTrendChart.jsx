import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatTooltipValue } from "../../utils/formatters";

export default function BalanceTrendChart({ monthlyTrend, darkMode }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <h2 className="mb-3 text-base font-semibold">Balance Trend</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrend} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke={darkMode ? "#334155" : "#cbd5e1"} vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
            <Tooltip formatter={formatTooltipValue} contentStyle={{ borderRadius: 12, border: "1px solid #94a3b8" }} />
            <Legend iconType="circle" />
            <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.2} fill="url(#incomeFill)" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.2} fill="url(#expenseFill)" />
            <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2.4} fill="url(#balanceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
