import { useState } from "react";
import { categories } from "../../data";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default function TransactionModal({ initial, onClose, onSave }) {
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
            <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="input" />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
                e.target.blur();
              }}
              className="input"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => {
                setForm({ ...form, type: e.target.value });
                e.target.blur();
              }}
              className="input"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </Field>
          <Field label="Description">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input md:col-span-2" />
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
