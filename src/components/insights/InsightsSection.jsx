import { Shield } from "lucide-react";

function InsightCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

export default function InsightsSection({ insights }) {
  return (
    <section className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <div className="mb-3 flex items-center gap-2 text-base font-semibold">
        <Shield size={18} /> Insights
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <InsightCard title="Highest Spending Category" value={insights.topCategory} />
        <InsightCard title="Monthly Comparison" value={insights.monthlyComparison} />
        <InsightCard title="Observation" value={insights.observation} />
      </div>
    </section>
  );
}
