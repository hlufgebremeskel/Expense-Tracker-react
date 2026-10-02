import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function ExpenseChart({ categoryTotals }) {
  // Empty state handling
  if (categoryTotals.length === 0) {
    return (
      <div className="expense-chart card">
        <h2>Spending by Category</h2>
        <p className="empty-state">No expenses this month to chart.</p>
      </div>
    );
  }

  // Find the max total to calculate bar widths correctly. 
  // The largest bar will be 100% wide.
  const maxTotal = Math.max(...categoryTotals.map(c => c.total));

  return (
    <div className="expense-chart card">
      <h2>Spending by Category</h2>
      <div className="chart-bars">
        {categoryTotals.map(({ category, total }) => {
          // Calculate percentage for CSS width
          const percentage = Math.round((total / maxTotal) * 100);
          
          return (
            <div key={category} className="chart-row">
              <div className="chart-label">
                <span>{category}</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
