import React, { useState, useMemo } from 'react';
import ExpenseItem from './ExpenseItem';
import CategoryChips from './CategoryChips';
import { groupByDate, sortExpenses } from '../utils/helpers';

export default function ExpenseList({ expenses, onStartEdit, onDeleteExpense, editingExpenseId, onFocusForm }) {
  // Local list controls: Search, Category Filter, and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Compute category counts for chips
  const categoryCounts = useMemo(() => {
    const counts = { All: expenses.length };
    expenses.forEach(exp => {
      counts[exp.category] = (counts[exp.category] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  // Filter and sort the list (Does NOT affect monthly totals or chart)
  const processedExpenses = useMemo(() => {
    let result = [...expenses];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(exp => exp.category === selectedCategory);
    }

    // Search query filter (case-insensitive title match)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(exp => exp.title.toLowerCase().includes(q));
    }

    // Sorting
    return sortExpenses(result, sortBy);
  }, [expenses, selectedCategory, searchQuery, sortBy]);

  // Group sorted list by date
  const dateGroups = useMemo(() => {
    return groupByDate(processedExpenses);
  }, [processedExpenses]);

  // Case 1: Entire month has no expenses at all
  if (expenses.length === 0) {
    return (
      <div className="expense-list-container card">
        <div className="list-header-simple">
          <h2>Transactions</h2>
        </div>
        <div className="empty-state-card">
          <div className="empty-state-illustration float-animation" aria-hidden="true">
            💸
          </div>
          <h3>No expenses this month</h3>
          <p>Get started by logging your first transaction for this month.</p>
          {onFocusForm && (
            <button 
              type="button" 
              className="btn-primary empty-cta-btn"
              onClick={onFocusForm}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add your first expense</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container card">
      {/* List Header & Controls */}
      <div className="list-top-bar">
        <div className="list-heading-row">
          <h2>
            Transactions
            <span className="list-count-badge">{processedExpenses.length}</span>
          </h2>

          {/* Sort Dropdown */}
          <div className="sort-selector-wrapper">
            <label htmlFor="expense-sort-select" className="sr-only">Sort by</label>
            <div className="custom-select-container">
              <select
                id="expense-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="newest">🕒 Newest Date</option>
                <option value="oldest">⏳ Oldest Date</option>
                <option value="highest">💰 Highest Amount</option>
                <option value="lowest">🪙 Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="search-bar-wrapper">
          <span className="search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions by title..."
            className="search-input"
            aria-label="Search transactions"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Case 2: Filter/Search returned zero matches */}
      {processedExpenses.length === 0 ? (
        <div className="empty-state-card empty-filtered-state">
          <div className="empty-state-illustration float-animation" aria-hidden="true">
            🔍
          </div>
          <h3>No matching transactions</h3>
          <p>We couldn't find anything matching your search or category filter.</p>
          <button
            type="button"
            className="btn-secondary clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Date Grouped Transaction List */
        <div className="date-grouped-list" role="feed" aria-label="Expenses grouped by date">
          {dateGroups.map((group) => (
            <div key={group.date} className="date-group-section">
              <div className="sticky-date-header">
                <span className="sticky-date-badge">{group.label}</span>
                <div className="date-divider-line" />
              </div>

              <ul className="expenses-ul" role="list">
                {group.items.map((expense) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
