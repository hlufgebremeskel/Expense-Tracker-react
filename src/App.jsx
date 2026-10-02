import React, { useState } from 'react';
import Header from './components/Header';
import MonthlySummary from './components/MonthlySummary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';
import { filterByMonth, getMonthTotal, groupByCategory } from './utils/helpers';

function App() {
  // Main state: Load and sync expenses to localStorage
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEY, []);
  
  // State for the currently selected month and year view
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // JS months are 0-indexed, we use 1-12
  
  // State to track which expense is currently being edited
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // Computed (derived) data. We calculate this on every render instead of putting it in state.
  const filteredExpenses = filterByMonth(expenses, selectedYear, selectedMonth);
  const monthlyTotal = getMonthTotal(filteredExpenses);
  const categoryTotals = groupByCategory(filteredExpenses);
  const editingExpense = expenses.find(exp => exp.id === editingExpenseId) || null;

  // Handler to move the month view back or forward
  const handleChangeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    
    // Handle wrap-around for years
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    
    // Cancel editing if navigating to a different month
    setEditingExpenseId(null);
  };

  // Handler to add a new expense
  const handleAddExpense = (newExpense) => {
    // We add the expense to the array. (Sorting happens in the list component)
    setExpenses([...expenses, newExpense]);
  };

  // Handler to update an existing expense
  const handleUpdateExpense = (updatedExpense) => {
    const newExpenses = expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    setExpenses(newExpenses);
    setEditingExpenseId(null); // Close edit mode
  };

  // Handler to delete an expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    // If we delete what we're currently editing, exit edit mode
    if (editingExpenseId === id) {
      setEditingExpenseId(null);
    }
  };

  // Handler to prepare the form for editing an expense
  const handleStartEdit = (id) => {
    setEditingExpenseId(id);
    
    // If the expense is from a different month than currently selected, switch the view
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      const [expYear, expMonth] = expense.date.split('-');
      setSelectedYear(parseInt(expYear, 10));
      setSelectedMonth(parseInt(expMonth, 10));
    }
  };

  // Handler to cancel edit mode
  const handleCancelEdit = () => {
    setEditingExpenseId(null);
  };

  return (
    <div className="container">
      <Header 
        year={selectedYear} 
        month={selectedMonth} 
        onChangeMonth={handleChangeMonth} 
      />
      
      <MonthlySummary 
        total={monthlyTotal} 
        count={filteredExpenses.length} 
      />
      
      <div className="main-layout">
        <div className="left-column">
          <ExpenseForm 
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onCancelEdit={handleCancelEdit}
            editingExpense={editingExpense}
          />
          <ExpenseChart 
            categoryTotals={categoryTotals} 
          />
        </div>
        
        <div className="right-column">
          <ExpenseList 
            expenses={filteredExpenses} 
            onStartEdit={handleStartEdit}
            onDeleteExpense={handleDeleteExpense}
            editingExpenseId={editingExpenseId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
