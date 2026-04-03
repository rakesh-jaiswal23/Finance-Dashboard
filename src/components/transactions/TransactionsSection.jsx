import { format, parseISO } from "date-fns";
import { Download, Search } from "lucide-react";
import { categories } from "../../data";
import { money } from "../../utils/formatters";

function SelectBox({ value, onChange, children }) {
  return (
    <select
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        e.target.blur();
      }}
    >
      {children}
    </select>
  );
}

export default function TransactionsSection({
  role,
  filters,
  paginatedTransactions,
  filteredCount,
  pageSize,
  currentPage,
  totalPages,
  onExportCsv,
  onExportJson,
  onUpdateFilters,
  onResetFilters,
  onEdit,
  onPrevPage,
  onNextPage,
}) {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Transactions</h2>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700" onClick={onExportCsv}>
            <Download size={14} /> CSV
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700" onClick={onExportJson}>
            <Download size={14} /> JSON
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-5">
        <label className="search-field col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition dark:border-slate-700">
          <Search size={16} className="text-slate-500" />
          <input className="search-input w-full bg-transparent py-2 outline-none" placeholder="Search category or description" value={filters.search} onChange={(e) => onUpdateFilters({ search: e.target.value })} />
        </label>
        <SelectBox value={filters.category} onChange={(v) => onUpdateFilters({ category: v })}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectBox>
        <SelectBox value={filters.type} onChange={(v) => onUpdateFilters({ type: v })}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </SelectBox>
        <div className="flex gap-2">
          <SelectBox value={filters.sortBy} onChange={(v) => onUpdateFilters({ sortBy: v })}>
            <option value="date">Sort by date</option>
            <option value="amount">Sort by amount</option>
          </SelectBox>
          <SelectBox value={filters.sortOrder} onChange={(v) => onUpdateFilters({ sortOrder: v })}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </SelectBox>
        </div>
      </div>

      <button className="mb-3 rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800" onClick={onResetFilters}>
        Reset filters
      </button>

      {!filteredCount ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">No transactions found for current filters.</div>
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
                      <button className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-200" onClick={() => onEdit(t)}>
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

      {filteredCount > pageSize && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredCount)} of {filteredCount}
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700" disabled={currentPage === 1} onClick={onPrevPage}>
              Prev
            </button>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800">
              Page {currentPage} / {totalPages}
            </span>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700" disabled={currentPage === totalPages} onClick={onNextPage}>
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
