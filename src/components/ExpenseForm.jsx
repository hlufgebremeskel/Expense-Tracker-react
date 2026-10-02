import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../utils/constants';
import { getTodayString } from '../utils/helpers';

export default function ExpenseForm({ onAddExpense, onUpdateExpense, onCancelEdit, editingExpense }) {
  // Local state for the form inputs
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState('');
  
  // Reference to focus the title input after adding
  const titleInputRef = useRef(null);

  // When editingExpense changes, update the form fields to match
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setError('');
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate(getTodayString());
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }
    if (!category) {
      setError('Category is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }

    // Clear previous errors if successful
    setError('');
    
    // Construct the expense object
    const expenseData = {
      title: title.trim(),
      amount: parsedAmount, // Must be a number
      category,
      date
    };

    if (editingExpense) {
      // Pass up the id if we are updating
      onUpdateExpense({ ...expenseData, id: editingExpense.id });
    } else {
      // Add a unique ID for new expenses
      const id = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      onAddExpense({ ...expenseData, id });
      
      resetForm();
      // Put focus back on the title field for quick entry
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  };

  return (
    <div className="expense-form card">
      <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title" 
            ref={titleInputRef}
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Lunch"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select Category...</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>

        <div className="form-actions">
          <button type="submit">{editingExpense ? 'Save' : 'Add'}</button>
          {editingExpense && (
            <button type="button" className="outline" onClick={onCancelEdit}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
