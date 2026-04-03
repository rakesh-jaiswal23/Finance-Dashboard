import { Moon, Plus, Sun } from "lucide-react";

export default function DashboardHeader({ role, darkMode, onRoleChange, onToggleDarkMode, onAddTransaction }) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Finance Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track, understand, and optimize your money flow</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={role}
          onChange={(e) => {
            onRoleChange(e.target.value);
            e.target.blur();
          }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          onClick={onToggleDarkMode}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Light" : "Dark"}
        </button>
        {role === "admin" && (
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            onClick={onAddTransaction}
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>
    </header>
  );
}
