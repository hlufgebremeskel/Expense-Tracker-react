import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function ExpenseItem({ expense, onStartEdit, onDeleteExpense, isEditing }) {
  const handleDelete = () => {
    // Confirm before destructive action
    if (window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      onDeleteExpense(expense.id);
    }
  };

  return (
    <li className={`expense-item ${isEditing ? 'editing' : ''}`}>
      <div className="expense-info">
        <h3>{expense.title}</h3>
        <p className="expense-meta">
          <span className="category-label">{expense.category}</span>
          <span className="expense-date">{expense.date}</span>
        </p>
      </div>
      <div className="expense-actions">
        <span className="amount">{formatCurrency(expense.amount)}</span>
        <button 
          className="outline small" 
          onClick={() => onStartEdit(expense.id)}
        >
          Edit
        </button>
        <button 
          className="danger small" 
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
