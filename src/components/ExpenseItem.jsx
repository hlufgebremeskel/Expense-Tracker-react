import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { getCategoryStyle } from '../utils/categoryStyles';

export default function ExpenseItem({ expense, onStartEdit, onDeleteExpense, isEditing }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const style = getCategoryStyle(expense.category);

  const handleDeleteClick = () => {
    // Start exit animation
    setIsRemoving(true);
    // Notify parent after animation completes
    setTimeout(() => {
      onDeleteExpense(expense.id);
    }, 250);
  };

  return (
    <li 
      className={`expense-item-row ${isEditing ? 'editing-row' : ''} ${isRemoving ? 'item-removing' : ''}`}
      style={{
        '--cat-accent': style.color,
        '--cat-bg': style.bgLight,
        '--cat-border': style.border,
      }}
    >
      {/* Category Icon Badge */}
      <div className="expense-icon-badge" aria-hidden="true">
        <span>{style.emoji}</span>
      </div>

      {/* Main Expense Info */}
      <div className="expense-content">
        <h3 className="expense-title">{expense.title}</h3>
        <div className="expense-meta-tags">
          <span className="category-pill">
            <span className="pill-dot" style={{ backgroundColor: style.color }} />
            {expense.category}
          </span>
          <span className="expense-meta-date">{expense.date}</span>
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="expense-trailing">
        <span className="expense-amount tabular-nums">
          {formatCurrency(expense.amount)}
        </span>

        <div className="expense-action-buttons">
          <button
            type="button"
            className="action-icon-btn edit-btn"
            onClick={() => onStartEdit(expense.id)}
            aria-label={`Edit ${expense.title}`}
            title="Edit expense"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={handleDeleteClick}
            aria-label={`Delete ${expense.title}`}
            title="Delete expense"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
