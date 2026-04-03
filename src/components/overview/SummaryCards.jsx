import { motion } from "framer-motion";
import { money } from "../../utils/formatters";

const summaryConfig = [
  ["Total Balance", "balance", "text-blue-600"],
  ["Income", "income", "text-emerald-600"],
  ["Expenses", "expense", "text-rose-600"],
];

export default function SummaryCards({ summary }) {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-3">
      {summaryConfig.map(([label, key, color], i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{money(Number(summary[key]))}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
