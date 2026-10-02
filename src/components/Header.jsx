import React from 'react';
import { formatMonthLabel } from '../utils/helpers';

export default function Header({ year, month, onChangeMonth }) {
  return (
    <header className="header card">
      <h1>Expense Tracker</h1>
      <div className="month-selector">
        <button 
          onClick={() => onChangeMonth(-1)} 
          aria-label="Previous month"
          className="outline"
        >
          &larr; Prev
        </button>
        <h2>{formatMonthLabel(year, month)}</h2>
        <button 
          onClick={() => onChangeMonth(1)} 
          aria-label="Next month"
          className="outline"
        >
          Next &rarr;
        </button>
      </div>
    </header>
  );
}
