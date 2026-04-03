import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Moon, Plus, Search, Shield, Sun } from "lucide-react";
import { categories } from "./data";
import { addTransaction, resetFilters, setRole, toggleDarkMode, updateFilters, updateTransaction } from "./store/financeSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6", "#eab308"];

const money = (n) => `Rs ${n.toLocaleString("en-IN")}`;

const download = (filename, data, mime) => {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function App() {
  const dispatch = useAppDispatch();
  const { role, darkMode, transactions, filters } = useAppSelector((s) => s.finance);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const term = filters.search.toLowerCase().trim();
    return [...transactions]
      .filter((t) => (filters.category === "all" ? true : t.category === filters.category))
      .filter((t) => (filters.type === "all" ? true : t.type === filters.type))
      .filter((t) => (term ? `${t.description} ${t.category}`.toLowerCase().includes(term) : true))
      .sort((a, b) => {
        const dir = filters.sortOrder === "asc" ? 1 : -1;
        if (filters.sortBy === "amount") return (a.amount - b.amount) * dir;
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
      });
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const monthlyTrend = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!map.has(key)) map.set(key, { month: format(parseISO(`${key}-01`), "MMM yy"), income: 0, expense: 0, balance: 0 });
      const item = map.get(key);
      if (t.type === "income") item.income += t.amount;
      else item.expense += t.amount;
      item.balance = item.income - item.expense;
    });
    return Array.from(map.values());
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const insights = useMemo(() => {
    const highest = categoryBreakdown[0];
    const current = monthlyTrend[monthlyTrend.length - 1];
    const previous = monthlyTrend[monthlyTrend.length - 2];
    const diff = current && previous ? current.expense - previous.expense : 0;
    return {
      topCategory: highest ? `${highest.name} (${money(highest.value)})` : "No expense data",
      monthlyComparison:
        current && previous
          ? `${diff >= 0 ? "Up" : "Down"} by ${money(Math.abs(diff))} vs previous month`
          : "Need at least 2 months of data",
      observation:
        summary.balance > 0
          ? `Net positive cashflow of ${money(summary.balance)}.`
          : `Spending is above income by ${money(Math.abs(summary.balance))}.`,
    };
  }, [categoryBreakdown, monthlyTrend, summary.balance]);
  const totalExpense = categoryBreakdown.reduce((acc, item) => acc + item.value, 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.category, filters.type, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const onExportJson = () => download("transactions.json", JSON.stringify(transactions, null, 2), "application/json");
  const onExportCsv = () => {
    const header = "date,description,category,type,amount";
    const rows = transactions.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`);
    download("transactions.csv", [header, ...rows].join("\n"), "text/csv");
  };

  const formatTooltip = (value) => {
    const raw = Array.isArray(value) ? value[0] : value;
    return money(Number(raw ?? 0));
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0_0%,_#f8fafc_45%,_#f8fafc_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#020617_45%,_#020617_100%)] dark:text-slate-100">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Finance Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track, understand, and optimize your money flow</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={role}
                onChange={(e) => dispatch(setRole(e.target.value))}
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                onClick={() => dispatch(toggleDarkMode())}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Light" : "Dark"}
              </button>
              {role === "admin" && (
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  onClick={() => {
                    setEditing(null);
                    setShowModal(true);
                  }}
                >
                  <Plus size={16} /> Add
                </button>
              )}
            </div>
          </header>

          <section className="mb-6 grid gap-4 md:grid-cols-3">
            {[
              ["Total Balance", summary.balance, "text-blue-600"],
              ["Income", summary.income, "text-emerald-600"],
              ["Expenses", summary.expense, "text-rose-600"],
            ].map(([label, value, color], i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${color}`}>{money(Number(value))}</p>
                </div>
              </motion.div>
            ))}
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-2">
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
                    <Tooltip formatter={formatTooltip} contentStyle={{ borderRadius: 12, border: "1px solid #94a3b8" }} />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.2} fill="url(#incomeFill)" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.2} fill="url(#expenseFill)" />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2.4} fill="url(#balanceFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
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
                      <Tooltip formatter={formatTooltip} />
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
          </section>

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

          <section className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold">Transactions</h2>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
                  onClick={onExportCsv}
                >
                  <Download size={14} /> CSV
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
                  onClick={onExportJson}
                >
                  <Download size={14} /> JSON
                </button>
              </div>
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-5">
              <label className="col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-slate-700">
                <Search size={16} className="text-slate-500" />
                <input
                  className="w-full bg-transparent py-2 outline-none"
                  placeholder="Search category or description"
                  value={filters.search}
                  onChange={(e) => dispatch(updateFilters({ search: e.target.value }))}
                />
              </label>
              <SelectBox value={filters.category} onChange={(v) => dispatch(updateFilters({ category: v }))}>
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectBox>
              <SelectBox value={filters.type} onChange={(v) => dispatch(updateFilters({ type: v }))}>
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </SelectBox>
              <div className="flex gap-2">
                <SelectBox value={filters.sortBy} onChange={(v) => dispatch(updateFilters({ sortBy: v }))}>
                  <option value="date">Sort by date</option>
                  <option value="amount">Sort by amount</option>
                </SelectBox>
                <SelectBox value={filters.sortOrder} onChange={(v) => dispatch(updateFilters({ sortOrder: v }))}>
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </SelectBox>
              </div>
            </div>

            <button className="mb-3 rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800" onClick={() => dispatch(resetFilters())}>
              Reset filters
            </button>

            {!filtered.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                No transactions found for current filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      {["Date", "Description", "Category", "Type", "Amount", "Action"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((t) => (
                      <tr key={t.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-3 py-2">{format(parseISO(t.date), "dd MMM yyyy")}</td>
                        <td className="px-3 py-2">{t.description}</td>
                        <td className="px-3 py-2">{t.category}</td>
                        <td className={`px-3 py-2 font-medium ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{t.type}</td>
                        <td className="px-3 py-2">{money(t.amount)}</td>
                        <td className="px-3 py-2">
                          {role === "admin" ? (
                            <button
                              className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-200"
                              onClick={() => {
                                setEditing(t);
                                setShowModal(true);
                              }}
                            >
                              Edit
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">Read only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filtered.length > pageSize && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {showModal && role === "admin" && (
        <TransactionModal
          initial={editing}
          onClose={() => setShowModal(false)}
          onSave={(payload) => {
            if (editing) dispatch(updateTransaction({ ...payload, id: editing.id }));
            else dispatch(addTransaction(payload));
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  children,
}) {
  return (
    <select
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

function InsightCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function TransactionModal({
  initial,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(
    initial ?? {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: 0,
      category: categories[0],
      type: "expense",
    }
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{initial ? "Edit Transaction" : "Add Transaction"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
          </Field>
          <Field label="Amount">
            <input
              type="number"
              min={0}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="input"
            />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </Field>
          <Field label="Description">
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input md:col-span-2"
            />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
            onClick={() => form.description.trim() && form.amount > 0 && onSave({ ...form, description: form.description.trim() })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      {children}
    </label>
  );
}
