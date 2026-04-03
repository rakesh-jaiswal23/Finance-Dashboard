import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { money } from "../utils/formatters";

export default function useDashboardData(transactions, filters) {
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
      monthlyComparison: current && previous ? `${diff >= 0 ? "Up" : "Down"} by ${money(Math.abs(diff))} vs previous month` : "Need at least 2 months of data",
      observation: summary.balance > 0 ? `Net positive cashflow of ${money(summary.balance)}.` : `Spending is above income by ${money(Math.abs(summary.balance))}.`,
    };
  }, [categoryBreakdown, monthlyTrend, summary.balance]);

  return { filtered, summary, monthlyTrend, categoryBreakdown, insights };
}
