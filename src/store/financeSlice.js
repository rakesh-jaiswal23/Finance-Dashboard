import { createSlice } from "@reduxjs/toolkit";
import { seedTransactions } from "../data";

const STORAGE_KEY = "finance-dashboard-state-v1";

const defaultState = {
  role: "admin",
  darkMode: false,
  transactions: seedTransactions,
  filters: {
    search: "",
    category: "all",
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  },
};

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

const persistState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const financeSlice = createSlice({
  name: "finance",
  initialState: loadState(),
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
      persistState(state);
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      persistState(state);
    },
    updateFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = defaultState.filters;
    },
    addTransaction(state, action) {
      state.transactions.unshift({ ...action.payload, id: crypto.randomUUID() });
      persistState(state);
    },
    updateTransaction(state, action) {
      const idx = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.transactions[idx] = action.payload;
        persistState(state);
      }
    },
  },
});

export const { setRole, toggleDarkMode, updateFilters, resetFilters, addTransaction, updateTransaction } =
  financeSlice.actions;
export default financeSlice.reducer;
