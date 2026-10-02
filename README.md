# Expense Tracker

A clean, modern, and minimal single-page React application to track your daily expenses, view monthly summaries, and analyze spending by category. Built for learning purposes to demonstrate React fundamentals.

## Features

- **Add, Edit, and Delete Expenses**: Full CRUD capabilities for expense management.
- **Categorization**: Predefined categories (Food, Transport, Bills, Shopping, Health, Entertainment, Other).
- **Monthly Filtering**: Navigate through months to see a filtered view of expenses and totals.
- **Spending Chart**: A custom-built HTML/CSS horizontal bar chart visualizing category distribution.
- **Local Storage Persistence**: Data is safely stored in the browser's `localStorage` and persists across page reloads.
- **Responsive Design**: Mobile-first approach, expanding to a two-column layout on wider screens.

## Tech Stack

- **React 18**: Functional components and Hooks.
- **Vite**: Fast build tool and development server.
- **JavaScript**: (No TypeScript) kept accessible for beginners.
- **Plain CSS**: Custom CSS variables, flexbox/grid layouts, no external styling libraries.

## Folder Structure

```text
expense-tracker/
├── index.html
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── Header.jsx          (App name and month selector)
    │   ├── MonthlySummary.jsx  (Monthly total + number of expenses)
    │   ├── ExpenseForm.jsx     (Add and edit modes)
    │   ├── ExpenseList.jsx     (Container for the list of items)
    │   ├── ExpenseItem.jsx     (Individual row: info and actions)
    │   └── ExpenseChart.jsx    (CSS bars showing spending per category)
    ├── hooks/
    │   └── useLocalStorage.js  (Syncs state with browser LocalStorage)
    ├── utils/
    │   ├── constants.js        (CATEGORIES, STORAGE_KEY)
    │   └── helpers.js          (Pure functions for formatting and calculations)
    ├── App.jsx                 (Main application state and architecture)
    ├── main.jsx                (Entry point)
    └── index.css               (Global CSS and styling variables)
```

## How to Run

1. Open your terminal in the root folder of this project.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the `localhost` URL provided in your terminal (usually `http://localhost:5173`) in your web browser.

## Concepts Used

- **`useState`**: Managing local component state, like form inputs, error messages, and the selected month/year.
- **`useEffect`**: Handling side effects, such as synchronizing the expenses array to `localStorage` automatically when it changes.
- **Props**: Passing data (like `expenses`) and callback functions (like `onAddExpense`) down from the parent `App.jsx` to its child components.
- **Controlled Inputs**: Binding HTML form inputs directly to React state for real-time tracking and submission handling.
- **Lifting State Up**: Keeping the single source of truth (the list of expenses and the selected month) in the top-level `App` component so all child components stay in sync.
- **Array Methods**: Utilizing `.map()` to render lists, `.filter()` to extract the selected month's expenses, and `.reduce()` to calculate totals.
- **Custom Hooks**: Abstracting the repetitive try/catch logic of interacting with `localStorage` into a reusable `useLocalStorage` function.
