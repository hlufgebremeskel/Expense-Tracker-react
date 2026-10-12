import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

const BUDGET_STORAGE_KEY = 'expense-tracker-budget';

export default function BudgetCard({ monthlyTotal }) {
  const [budget, setBudget] = useState(() => {
    try {
      const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleStartSetBudget = () => {
    setInputValue(budget ? budget.toString() : '');
    setInputError('');
    setIsEditing(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const parsed = Number(inputValue);
    if (!inputValue || isNaN(parsed) || parsed <= 0) {
      setInputError('Please enter a budget greater than $0.');
      return;
    }

    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, parsed.toString());
    } catch {
      // Storage unavailable fallback
    }

    setBudget(parsed);
    setIsEditing(false);
    setInputError('');
  };

  const handleRemoveBudget = () => {
    try {
      localStorage.removeItem(BUDGET_STORAGE_KEY);
    } catch {
      // Storage fallback
    }
    setBudget(null);
    setIsEditing(false);
  };

  // State 1: Setting / Editing form
  if (isEditing) {
    return (
      <div className="budget-card card">
        <div className="budget-header">
          <div className="budget-title-group">
            <span className="budget-icon" aria-hidden="true">🎯</span>
            <h2>{budget ? 'Edit Monthly Budget' : 'Set Monthly Budget'}</h2>
          </div>
        </div>

        <form onSubmit={handleSaveBudget} className="budget-form">
          <div className="form-group">
            <label htmlFor="budget-amount-input">Target Amount</label>
            <div className="input-wrapper currency-input-wrapper">
              <span className="currency-symbol" aria-hidden="true">$</span>
              <input
                type="number"
                id="budget-amount-input"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError('');
                }}
                placeholder="e.g. 2000"
                step="1"
                min="1"
                className="text-input currency-input tabular-nums"
                autoFocus
              />
            </div>
            {inputError && (
              <span className="field-error-msg" role="alert">{inputError}</span>
            )}
          </div>

          <div className="budget-form-actions">
            <button type="submit" className="btn-primary small-btn">Save</button>
            <button 
              type="button" 
              className="btn-secondary small-btn" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            {budget && (
              <button 
                type="button" 
                className="btn-danger-outline small-btn"
                onClick={handleRemoveBudget}
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // State 2: No budget set yet
  if (!budget) {
    return (
      <div className="budget-card card budget-empty-card">
        <div className="budget-cta-content">
          <div className="budget-cta-icon-wrap" aria-hidden="true">
            🎯
          </div>
          <div className="budget-cta-text">
            <h3>Set a Monthly Budget</h3>
            <p>Keep track of your spending limit and watch your savings grow.</p>
          </div>
          <button 
            type="button" 
            className="btn-secondary budget-cta-btn"
            onClick={handleStartSetBudget}
          >
            + Set Budget
          </button>
        </div>
      </div>
    );
  }

  // State 3: Active budget progress display
  const percentUsed = Math.round((monthlyTotal / budget) * 100);
  const isOverBudget = monthlyTotal > budget;
  const remaining = budget - monthlyTotal;
  const overAmount = monthlyTotal - budget;

  // Determine color status based on percentage
  let statusClass = 'budget-status-green';
  if (percentUsed >= 100) {
    statusClass = 'budget-status-red';
  } else if (percentUsed >= 70) {
    statusClass = 'budget-status-amber';
  }

  return (
    <div className={`budget-card card ${statusClass} ${isOverBudget ? 'pulse-once' : ''}`}>
      <div className="budget-header">
        <div className="budget-title-group">
          <span className="budget-icon" aria-hidden="true">🎯</span>
          <h2>Monthly Budget</h2>
        </div>
        <button
          type="button"
          onClick={handleStartSetBudget}
          className="budget-edit-link"
          aria-label="Edit budget target"
          title="Edit budget"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Edit</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="budget-progress-section">
        <div className="budget-progress-labels">
          <span className="budget-percent-label tabular-nums">
            {percentUsed}% used
          </span>
          <span className="budget-target-label tabular-nums">
            Target: {formatCurrency(budget)}
          </span>
        </div>

        <div 
          className="budget-progress-track"
          role="progressbar"
          aria-valuenow={Math.min(percentUsed, 100)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Budget consumption percentage"
        >
          <div 
            className="budget-progress-fill"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Status Summary */}
      <div className="budget-footer-stats">
        {isOverBudget ? (
          <div className="budget-alert-over">
            <span className="budget-alert-icon" aria-hidden="true">⚠️</span>
            <span>Over budget by <strong>{formatCurrency(overAmount)}</strong></span>
          </div>
        ) : (
          <div className="budget-alert-under">
            <span className="budget-alert-icon" aria-hidden="true">✨</span>
            <span><strong>{formatCurrency(remaining)}</strong> remaining this month</span>
          </div>
        )}
      </div>
    </div>
  );
}
