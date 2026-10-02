import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function MonthlySummary({ total, count }) {
  return (
    <div className="summary card">
      <h2>Monthly Summary</h2>
      <div className="summary-details">
        <div>
          <span className="label">Total Spent</span>
          <span className="amount">{formatCurrency(total)}</span>
        </div>
        <div>
          <span className="label">Total Expenses</span>
          <span className="count">{count}</span>
        </div>
      </div>
    </div>
  );
}
