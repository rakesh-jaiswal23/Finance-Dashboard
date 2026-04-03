import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatTooltipValue, money } from "../../utils/formatters";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6", "#eab308"];

export default function SpendingBreakdown({ categoryBreakdown }) {
  const totalExpense = categoryBreakdown.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <h2 className="mb-3 text-base font-semibold">Spending Breakdown</h2>
      <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
        <div className="h-64">
          {categoryBreakdown.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={88} innerRadius={48} paddingAngle={2}>
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No expense data available</div>
          )}
        </div>
        <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/50">
          {categoryBreakdown.length ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category Details</p>
              {categoryBreakdown.slice(0, 6).map((item, index) => {
                const pct = totalExpense ? Math.round((item.value / totalExpense) * 100) : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-right text-xs text-slate-500">{pct}%</span>
                  </div>
                );
              })}
              <div className="pt-1 text-xs font-medium text-slate-600 dark:text-slate-300">Total: {money(totalExpense)}</div>
            </>
          ) : (
            <p className="text-slate-500">No category data</p>
          )}
        </div>
      </div>
    </div>
  );
}
