import React from 'react';
import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ expenses, onStartEdit, onDeleteExpense, editingExpenseId }) {
  // Empty state handling
  if (expenses.length === 0) {
    return (
      <div className="expense-list card">
        <h2>Expenses</h2>
        <p className="empty-state">No expenses this month.</p>
      </div>
    );
  }

  // Sort expenses: newest dates first
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="expense-list card">
      <h2>Expenses</h2>
      <ul>
        {sortedExpenses.map(expense => (
          <ExpenseItem 
            key={expense.id} 
            expense={expense} 
            onStartEdit={onStartEdit} 
            onDeleteExpense={onDeleteExpense}
            isEditing={expense.id === editingExpenseId}
          />
        ))}
      </ul>
    </div>
  );
}
