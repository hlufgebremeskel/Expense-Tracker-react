# Expense Tracker — Modern Fintech Dashboard 💸

A modern, high-performance, and privacy-first personal finance application built with **React 19 + Vite + Plain CSS + LocalStorage**. Features a calm card-based design with an electric violet accent, zero external UI libraries, fluid animations, pure SVG charts, dark/light theme switching, and instant Undo.

---

## 🎨 Design Features

### 1. Modern Fintech Dashboard Aesthetic
- **Card-Based Architecture**: Clear separation of concern with generous spacing, soft drop shadows, and subtle ambient blur glow blobs.
- **Electric Accent Theme**: Cohesive violet/indigo palette (`#6366f1` to `#8b5cf6`) across hero cards, primary buttons, focus states, and key metrics.
- **Typography & Precision**: Clean typography powered by Google Fonts `Inter` with `font-variant-numeric: tabular-nums` for aligned financial numbers.

### 2. Dark Mode & Light Mode (Zero-FOUC)
- **Early Theme Detection**: Detects user's system preference (`prefers-color-scheme`) with zero theme flashing on page load.
- **Persistent Toggle**: Persists choice to `localStorage` (`expense-tracker-theme`).
- **Smooth Transition**: 300ms color and background transitions when toggling via the sun/moon inline SVG button.

### 3. Hero Summary Card & Count-Up Motion
- **Big Animated Number**: Selected month total counts up smoothly over 600ms via a custom `useCountUp` hook using `requestAnimationFrame`.
- **Stat Chips**: Total transactions count, average expense, and highest single expense.
- **Trend Indicator**: Dynamic comparison against the previous month (`▲ +X%` red when spending rose, `▼ -X%` green when spending dropped; hidden if no prior month data exists).

### 4. Interactive Donut Chart (Pure SVG)
- **Mathematical SVG Donut**: Animated circular slices calculated with `stroke-dasharray` and `stroke-dashoffset` over 800ms.
- **Dual Highlighting**: Hovering any chart slice dims other slices and highlights the matching legend row; hovering legend items highlights the slice in real time.
- **Horizontal Progress Bars**: Legend includes category emojis, percentages, dollar amounts, and animated width progress bars.
- **Center Total**: Prominently shows total month spending and hovered category details in the donut hole.

### 5. Monthly Budget Tracker
- **Budget Goal**: Set and update monthly budgets stored in LocalStorage (`expense-tracker-budget`).
- **Dynamic 3-Tier Status Bar**:
  - 🟢 **Green**: Under 70% of budget.
  - 🟡 **Amber**: 70% to 99% of budget.
  - 🔴 **Red**: 100%+ (Over budget alert with subtle pulse feedback).
- **Remaining / Over Amount**: Live calculations showing remaining money or overage.

### 6. Filter Chips, Instant Search & Sorting
- **Category Chips**: Horizontally scrollable category pills with custom slim scrollbars. Clicking an active chip fills it with category branding color.
- **Real-Time Search**: Instant search by transaction title with a one-click clear button (`✕`).
- **Sort Options**: Sort by **Newest Date**, **Oldest Date**, **Highest Amount**, or **Lowest Amount**.
- **Display-Only Filtering**: Filtering and searching only filter the list view; monthly total and chart always preserve the full month's analytics.

### 7. Date-Grouped Transaction List & Sticky Headings
- **Grouped by Date**: Chronologically organized under sticky badges (`Today`, `Yesterday`, or formatted date like `Oct 12`).
- **Category Identity Badges**: Color-coordinated badge with emojis (`🍔 Food`, `🚌 Transport`, `🧾 Bills`, `🛍️ Shopping`, `💊 Health`, `🎬 Entertainment`, `📦 Other`).
- **Hover Micro-Interactions**: Hovering a transaction card lifts it with smooth `translateY(-2px)` and shadow elevation.

### 8. Accessible Toast Notifications & Undo Delete
- **Non-Intrusive Workflow**: Replaces disruptive native `window.confirm` dialogs.
- **6-Second Undo Window**: Deleting an item triggers a toast notification with an **Undo** button. Clicking Undo immediately restores the item to its exact position.
- **Accessible Notification**: Implements `role="status"` and `aria-live="polite"` with visual progress bar countdowns.

### 9. Interactive Form Polish
- **Category Radio Grid**: Keyboard-accessible chip selector for categories with custom focus rings.
- **Currency Input Prefix**: Integrated `$` prefix styling.
- **Inline Validation & Shake Animation**: Invalid fields trigger a gentle horizontal shake and clear inline error messages.
- **Editing Mode**: Edit transactions with a glowing border and `Editing` badge.

### 10. Performance & Accessibility
- **Reduced Motion Support**: Complete `@media (prefers-reduced-motion: reduce)` support that disables non-essential animations.
- **Mobile First**: Fully responsive down to 360px without horizontal scroll, plus a mobile Floating Action Button (FAB).
- **100% Private**: All data stays client-side in the browser's LocalStorage.

---

## 📸 Screenshots

### Desktop Light Mode
![Desktop Dashboard (Light Mode)](https://via.placeholder.com/1200x700/f8fafc/6366f1?text=Expense+Tracker+-+Desktop+Light+Dashboard)

### Desktop Dark Mode
![Desktop Dashboard (Dark Mode)](https://via.placeholder.com/1200x700/0a0f1d/818cf8?text=Expense+Tracker+-+Desktop+Dark+Dashboard)

### Interactive Donut Chart & Category Breakdown
![Donut Chart & Legend](https://via.placeholder.com/600x400/111827/6366f1?text=SVG+Donut+Chart+with+Hover+Highlighting)

### Toast Notification with Instant Undo
![Toast Notification](https://via.placeholder.com/400x120/111827/ef4444?text=Toast+Notification+with+Undo+Button)

---

## 🛠️ Tech Stack

- **React 19**: Modern functional architecture with standard React 19 practices.
- **Vite 8**: Ultra-fast build tool and dev server.
- **Plain CSS**: Custom design system, CSS variables, CSS transitions/keyframes, and zero external CSS libraries.
- **Pure SVG & Emoji**: Inline vector icons and SVG charts without external icon packages.
- **Zero New Dependencies**: Kept `package.json` lean and pristine.

---

## 📁 Project Structure

```text
expense-tracker/
├── index.html                  (Inter Google Font, SVG Favicon, early theme init)
├── package.json                (Zero external UI/animation dependencies)
├── README.md                   (Documentation and architecture guide)
└── src/
    ├── components/
    │   ├── Header.jsx          (Brand, pill month selector, ThemeToggle)
    │   ├── ThemeToggle.jsx     (Sun/moon SVG toggle with 300ms smooth transition)
    │   ├── MonthlySummary.jsx  (Hero gradient card, count-up total, stat chips, trend pill)
    │   ├── StatChip.jsx        (Animated stat chip with count-up hook)
    │   ├── ExpenseForm.jsx     (Category radio chips, $ prefix, shake validation)
    │   ├── ExpenseList.jsx     (Search, category filter chips, sort, date grouping)
    │   ├── ExpenseItem.jsx     (Category badge, tabular amount, edit/delete, exit animation)
    │   ├── CategoryChips.jsx   (Horizontally scrollable category filter pills)
    │   ├── ExpenseChart.jsx    (Chart container, interactive legend, progress bars)
    │   ├── DonutChart.jsx      (Pure SVG donut with stroke-dasharray & hover effects)
    │   ├── BudgetCard.jsx      (Monthly budget, 3-tier color progress, over-budget alert)
    │   └── Toast.jsx           (Accessible toast notification with Undo action)
    ├── hooks/
    │   ├── useLocalStorage.js  (Client-side state persistence)
    │   └── useCountUp.js       (requestAnimationFrame count-up with reduced-motion support)
    ├── utils/
    │   ├── constants.js        (CATEGORIES list, STORAGE_KEY)
    │   ├── categoryStyles.js   (Category colors, emojis, and background tints)
    │   └── helpers.js          (Pure math, formatting, date grouping, sorting, trend change)
    ├── App.jsx                 (Dashboard layout, month slide transitions, undo handler)
    ├── main.jsx                (React application entry point)
    └── index.css               (Fintech design system, dark/light CSS tokens, animations)
```

---

## 🚀 Getting Started

1. Clone or open the repository:
   ```bash
   cd Expense-Tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Check code quality:
   ```bash
   npm run lint
   ```

---

## 🔒 Privacy

All transactions, monthly budgets, and theme preferences are stored locally in your browser's `localStorage`. No data is ever transmitted to any third-party server or external analytics platform.
