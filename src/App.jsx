import { useState } from "react";
import {
  addTransaction,
  resetFilters,
  setRole,
  toggleDarkMode,
  updateFilters,
  updateTransaction,
} from "./store/financeSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  exportTransactionsCsv,
  exportTransactionsJson,
} from "./utils/exporters";
import useDashboardData from "./hooks/useDashboardData";
import usePagination from "./hooks/usePagination";
import DashboardHeader from "./components/layout/DashboardHeader";
import SummaryCards from "./components/overview/SummaryCards";
import BalanceTrendChart from "./components/charts/BalanceTrendChart";
import SpendingBreakdown from "./components/charts/SpendingBreakdown";
import InsightsSection from "./components/insights/InsightsSection";
import TransactionsSection from "./components/transactions/TransactionsSection";
import TransactionModal from "./components/transactions/TransactionModal";

export default function App() {
  const dispatch = useAppDispatch();
  const { role, darkMode, transactions, filters } = useAppSelector(
    (s) => s.finance,
  );
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 6;

  const { filtered, summary, monthlyTrend, categoryBreakdown, insights } =
    useDashboardData(transactions, filters);
  const { currentPage, totalPages, paginatedItems, prevPage, nextPage } =
    usePagination(filtered, pageSize, [
      filters.search,
      filters.category,
      filters.type,
      filters.sortBy,
      filters.sortOrder,
    ]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0_0%,_#f8fafc_45%,_#f8fafc_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#020617_45%,_#020617_100%)] dark:text-slate-100">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <DashboardHeader
            role={role}
            darkMode={darkMode}
            onRoleChange={(nextRole) => dispatch(setRole(nextRole))}
            onToggleDarkMode={() => dispatch(toggleDarkMode())}
            onAddTransaction={() => {
              setEditing(null);
              setShowModal(true);
            }}
          />
          <SummaryCards summary={summary} />
          <section className="mb-6 grid gap-4 lg:grid-cols-2">
            <BalanceTrendChart
              monthlyTrend={monthlyTrend}
              darkMode={darkMode}
            />
            <SpendingBreakdown categoryBreakdown={categoryBreakdown} />
          </section>
          <InsightsSection insights={insights} />
          <TransactionsSection
            role={role}
            filters={filters}
            paginatedTransactions={paginatedItems}
            filteredCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onExportCsv={() => exportTransactionsCsv(transactions)}
            onExportJson={() => exportTransactionsJson(transactions)}
            onUpdateFilters={(next) => dispatch(updateFilters(next))}
            onResetFilters={() => dispatch(resetFilters())}
            onEdit={(tx) => {
              setEditing(tx);
              setShowModal(true);
            }}
            onPrevPage={prevPage}
            onNextPage={nextPage}
          />
        </div>
      </div>

      {showModal && role === "admin" && (
        <TransactionModal
          initial={editing}
          onClose={() => setShowModal(false)}
          onSave={(payload) => {
            if (editing)
              dispatch(updateTransaction({ ...payload, id: editing.id }));
            else dispatch(addTransaction(payload));
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
