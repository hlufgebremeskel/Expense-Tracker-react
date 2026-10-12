import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../utils/constants';
import { getCategoryStyle } from '../utils/categoryStyles';
import { getTodayString } from '../utils/helpers';

export default function ExpenseForm({ onAddExpense, onUpdateExpense, onCancelEdit, editingExpense }) {
  // Input states initialized directly from editingExpense (or default empty)
  const [title, setTitle] = useState(() => (editingExpense ? editingExpense.title : ''));
  const [amount, setAmount] = useState(() => (editingExpense ? editingExpense.amount.toString() : ''));
  const [category, setCategory] = useState(() => (editingExpense ? editingExpense.category : ''));
  const [date, setDate] = useState(() => (editingExpense ? editingExpense.date : getTodayString()));

  // Field-specific validation errors and shake animation
  const [errors, setErrors] = useState({});
  const [shakingField, setShakingField] = useState(null);

  // Success indicator for add button
  const [showSuccess, setShowSuccess] = useState(false);

  // Reference to focus title input
  const titleInputRef = useRef(null);

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (field === 'title') setTitle(value);
    if (field === 'amount') setAmount(value);
    if (field === 'category') setCategory(value);
    if (field === 'date') setDate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate Title
    if (!title.trim()) {
      newErrors.title = 'Please provide a title for the expense.';
    }

    // Validate Amount
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than $0.';
    }

    // Validate Category
    if (!category) {
      newErrors.category = 'Please select a category.';
    }

    // Validate Date
    if (!date) {
      newErrors.date = 'Please pick a valid date.';
    }

    // If there are validation errors, trigger shake on the first faulty field
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstInvalidKey = Object.keys(newErrors)[0];
      setShakingField(firstInvalidKey);
      setTimeout(() => setShakingField(null), 500);
      return;
    }

    // Clear previous errors
    setErrors({});

    const expensePayload = {
      title: title.trim(),
      amount: parsedAmount,
      category,
      date
    };

    if (editingExpense) {
      onUpdateExpense({ ...expensePayload, id: editingExpense.id });
    } else {
      const id = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      onAddExpense({ ...expensePayload, id });

      // Trigger brief success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1400);

      // Reset form
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(getTodayString());

      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  };

  return (
    <div className={`expense-form card ${editingExpense ? 'form-editing-mode' : ''}`}>
      <div className="form-header">
        <div className="form-header-title-group">
          <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <p className="form-subtitle">
            {editingExpense ? 'Make changes to this transaction' : 'Log your recent spending'}
          </p>
        </div>

        {editingExpense && (
          <span className="editing-badge">
            <span className="badge-pulse" />
            Editing
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title Input */}
        <div className={`form-group ${errors.title ? 'has-error' : ''} ${shakingField === 'title' ? 'shake-element' : ''}`}>
          <label htmlFor="expense-title">Title</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="expense-title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Grocery run, Coffee, Utilities"
              className="text-input"
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
          </div>
          {errors.title && (
            <span id="title-error" className="field-error-msg" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        {/* Amount Input with Currency Prefix */}
        <div className={`form-group ${errors.amount ? 'has-error' : ''} ${shakingField === 'amount' ? 'shake-element' : ''}`}>
          <label htmlFor="expense-amount">Amount</label>
          <div className="input-wrapper currency-input-wrapper">
            <span className="currency-symbol" aria-hidden="true">$</span>
            <input
              type="number"
              id="expense-amount"
              value={amount}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="text-input currency-input tabular-nums"
              aria-invalid={errors.amount ? 'true' : 'false'}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
          </div>
          {errors.amount && (
            <span id="amount-error" className="field-error-msg" role="alert">
              {errors.amount}
            </span>
          )}
        </div>

        {/* Category Chip Selector */}
        <div className={`form-group ${errors.category ? 'has-error' : ''} ${shakingField === 'category' ? 'shake-element' : ''}`}>
          <label id="category-selector-label">Category</label>
          <div
            className="category-chips-grid"
            role="radiogroup"
            aria-labelledby="category-selector-label"
          >
            {CATEGORIES.map((cat) => {
              const style = getCategoryStyle(cat);
              const isSelected = category === cat;

              return (
                <label
                  key={cat}
                  className={`category-select-chip ${isSelected ? 'selected' : ''}`}
                  style={{
                    '--cat-accent': style.color,
                    '--cat-bg': style.bgLight,
                  }}
                >
                  <input
                    type="radio"
                    name="expense-category"
                    value={cat}
                    checked={isSelected}
                    onChange={() => handleFieldChange('category', cat)}
                    className="sr-only"
                  />
                  <span className="chip-emoji" aria-hidden="true">{style.emoji}</span>
                  <span className="chip-name">{cat}</span>
                </label>
              );
            })}
          </div>
          {errors.category && (
            <span className="field-error-msg" role="alert">
              {errors.category}
            </span>
          )}
        </div>

        {/* Date Input */}
        <div className={`form-group ${errors.date ? 'has-error' : ''} ${shakingField === 'date' ? 'shake-element' : ''}`}>
          <label htmlFor="expense-date">Date</label>
          <div className="input-wrapper">
            <input
              type="date"
              id="expense-date"
              value={date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="text-input date-input"
              aria-invalid={errors.date ? 'true' : 'false'}
              aria-describedby={errors.date ? 'date-error' : undefined}
            />
          </div>
          {errors.date && (
            <span id="date-error" className="field-error-msg" role="alert">
              {errors.date}
            </span>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button 
            type="submit" 
            className={`btn-primary submit-btn ${showSuccess ? 'btn-success-state' : ''}`}
          >
            {showSuccess ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added!</span>
              </>
            ) : editingExpense ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Expense</span>
              </>
            )}
          </button>

          {editingExpense && (
            <button 
              type="button" 
              className="btn-secondary cancel-btn" 
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
