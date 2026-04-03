# Finance Dashboard UI

A modern, responsive finance dashboard built with React, Tailwind CSS, and Redux Toolkit for the Frontend Developer Intern assignment.

## Tech Stack

- React + Vite + JavaScript
- Tailwind CSS (v4)
- Redux Toolkit + React Redux
- Recharts for visualizations
- Framer Motion for subtle UI animations

## Features Implemented

### Core requirements
- Dashboard overview with summary cards: Total Balance, Income, Expenses
- Time-based visualization: monthly balance/income/expense trend
- Categorical visualization: spending breakdown pie chart
- Transactions table with date, amount, category, type, and description
- Filtering by category/type, sorting by date/amount, and search
- Basic role-based UI simulation:
  - Viewer: read-only mode
  - Admin: can add/edit transactions
- Insights section:
  - Highest spending category
  - Monthly expense comparison
  - Useful balance observation
- Centralized state management with Redux Toolkit

### Optional enhancements included
- Dark mode toggle
- Local storage persistence for role, theme, and transactions
- Export transactions to CSV and JSON
- Smooth micro-animations on cards
- Empty state handling for filtered/no data cases
- Fully responsive layout across mobile/tablet/desktop

## Project Structure

- `src/App.jsx` - Main dashboard UI and feature logic
- `src/store/financeSlice.js` - Redux slice for role/theme/filters/transactions
- `src/store/index.js` - Store setup
- `src/store/hooks.js` - Redux hooks
- `src/data.js` - Mock transaction seed data and categories
- `src/style.css` - Tailwind import + small utility styles

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview
```

## Notes

- The app uses frontend-only mock data and simulated role behavior as requested.
- Data changes persist in browser storage, so refresh will keep updates.
