import React, { useState, useRef } from 'react';
import Header from './components/Header';
import MonthlySummary from './components/MonthlySummary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import BudgetCard from './components/BudgetCard';
import Toast from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';
import { 
  filterByMonth, 
  getMonthTotal, 
  groupByCategory, 
  getPreviousMonthTotal, 
  formatMonthLabel 
} from './utils/helpers';

function App() {
  // Main state: Synchronized with localStorage
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEY, []);
  
  // Selected view month and year (lazy initializers to maintain pure render)
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  
  // Navigation animation direction: 'slide-left' (next) or 'slide-right' (prev)
  const [slideDirection, setSlideDirection] = useState('slide-none');

  // Currently editing expense ID
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // Active toasts
  const [toasts, setToasts] = useState([]);

  // Form reference for mobile scroll-to-form FAB and empty-state button
  const formRef = useRef(null);

  // Derived data for the selected month
  const filteredExpenses = filterByMonth(expenses, selectedYear, selectedMonth);
  const monthlyTotal = getMonthTotal(filteredExpenses);
  const previousMonthTotal = getPreviousMonthTotal(expenses, selectedYear, selectedMonth);
  const categoryTotals = groupByCategory(filteredExpenses);
  const editingExpense = expenses.find(exp => exp.id === editingExpenseId) || null;
  const monthLabel = formatMonthLabel(selectedYear, selectedMonth);

  // Toast dispatch helper
  const addToast = (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Month navigation with direction-aware sliding animation
  const handleChangeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    // Set slide animation direction
    setSlideDirection(delta > 0 ? 'slide-from-right' : 'slide-from-left');
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setEditingExpenseId(null);
  };

  // Add new expense
  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    addToast({
      message: `Added "${newExpense.title}"`,
      type: 'success',
      duration: 3500,
    });
  };

  // Update existing expense
  const handleUpdateExpense = (updatedExpense) => {
    const newExpenses = expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    setExpenses(newExpenses);
    setEditingExpenseId(null);
    addToast({
      message: `Saved changes to "${updatedExpense.title}"`,
      type: 'info',
      duration: 3500,
    });
  };

  // Delete expense with immediate toast & Undo capability
  const handleDeleteExpense = (id) => {
    const itemIndex = expenses.findIndex(exp => exp.id === id);
    if (itemIndex === -1) return;

    const deletedItem = expenses[itemIndex];
    const newExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(newExpenses);

    if (editingExpenseId === id) {
      setEditingExpenseId(null);
    }

    // Show Undo Toast with a generous 6-second window
    addToast({
      message: `Deleted "${deletedItem.title}"`,
      type: 'delete',
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          // Restore item at its original position
          setExpenses(currentExpenses => {
            const restored = [...currentExpenses];
            restored.splice(itemIndex, 0, deletedItem);
            return restored;
          });
          addToast({
            message: `Restored "${deletedItem.title}"`,
            type: 'success',
            duration: 3500,
          });
        }
      }
    });
  };

  // Start edit mode
  const handleStartEdit = (id) => {
    setEditingExpenseId(id);
    
    // If expense belongs to another month, switch the active view
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      const [expYear, expMonth] = expense.date.split('-');
      const targetYear = parseInt(expYear, 10);
      const targetMonth = parseInt(expMonth, 10);
      if (targetYear !== selectedYear || targetMonth !== selectedMonth) {
        setSelectedYear(targetYear);
        setSelectedMonth(targetMonth);
      }
    }

    // Smoothly scroll form into view on smaller viewports
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
  };

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = formRef.current.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  return (
    <div className="app-root">
      {/* Background ambient gradient glow blobs */}
      <div className="ambient-blob ambient-blob-1" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-2" aria-hidden="true" />

      <div className="container">
        {/* Header with Month Switcher & Dark/Light Theme Toggle */}
        <Header 
          year={selectedYear} 
          month={selectedMonth} 
          onChangeMonth={handleChangeMonth} 
        />
        
        {/* Main Content Area with slide/fade transition when navigating months */}
        <div key={`${selectedYear}-${selectedMonth}`} className={`month-view-wrapper ${slideDirection}`}>
          {/* Hero Summary Card with Big Count-up Total & Trend Pill */}
          <MonthlySummary 
            total={monthlyTotal} 
            count={filteredExpenses.length} 
            expenses={filteredExpenses}
            previousTotal={previousMonthTotal}
            monthLabel={monthLabel}
          />
          
          {/* Main Dashboard Layout */}
          <main className="main-layout">
            {/* Sidebar Column: Form, Budget, and Category Chart */}
            <aside className="sidebar-column">
              <div ref={formRef} className="form-anchor">
                <ExpenseForm 
                  key={editingExpense ? editingExpense.id : 'create-new'}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onCancelEdit={handleCancelEdit}
                  editingExpense={editingExpense}
                />
              </div>

              <BudgetCard 
                monthlyTotal={monthlyTotal} 
              />

              <ExpenseChart 
                categoryTotals={categoryTotals} 
              />
            </aside>
            
            {/* Main Column: Filterable, Searchable, Date-Grouped Transaction List */}
            <section className="primary-column" aria-label="Transactions list">
              <ExpenseList 
                expenses={filteredExpenses} 
                onStartEdit={handleStartEdit}
                onDeleteExpense={handleDeleteExpense}
                editingExpenseId={editingExpenseId}
                onFocusForm={handleScrollToForm}
              />
            </section>
          </main>
        </div>

        {/* Floating Action Button (FAB) on mobile for fast entry */}
        <button
          type="button"
          className="mobile-fab"
          onClick={handleScrollToForm}
          aria-label="Add new expense"
          title="Add expense"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Global Toast Notifications Container */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Dashboard Footer */}
        <footer className="app-footer">
          <p>
            <span className="privacy-badge">🔒 100% Private</span>
            Your data stays in your browser's LocalStorage. No tracking, no external servers.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
