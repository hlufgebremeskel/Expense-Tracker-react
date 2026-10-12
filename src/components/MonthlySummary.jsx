import React from 'react';
import StatChip from './StatChip';
import { useCountUp } from '../hooks/useCountUp';
import { formatCurrency, getPercentChange } from '../utils/helpers';

export default function MonthlySummary({ total, count, expenses = [], previousTotal = 0, monthLabel = '' }) {
  // Animate the hero total count-up
  const animatedTotal = useCountUp(total, 600);

  // Derived statistics for the stat chips
  const averageAmount = count > 0 ? total / count : 0;
  const biggestExpense = count > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  // Comparison with previous month
  const percentChange = getPercentChange(total, previousTotal);
  const hasPreviousData = previousTotal > 0 && percentChange !== null;

  return (
    <section className="hero-summary card gradient-card" aria-label="Monthly Financial Summary">
      <div className="hero-header">
        <div className="hero-caption-wrapper">
          <span className="hero-badge">Overview</span>
          <span className="hero-caption">
            {monthLabel ? `${monthLabel} Spending` : 'Total Spent'}
          </span>
        </div>

        {/* Trend Indicator versus previous month */}
        {hasPreviousData && (
          <div 
            className={`trend-pill ${percentChange > 0 ? 'trend-up' : 'trend-down'}`}
            title={`Comparison vs previous month ($${previousTotal.toFixed(2)})`}
          >
            <span className="trend-arrow" aria-hidden="true">
              {percentChange > 0 ? '▲' : '▼'}
            </span>
            <span className="trend-value tabular-nums">
              {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
            </span>
            <span className="trend-context">vs last mo</span>
          </div>
        )}
      </div>

      {/* Hero Large Animated Amount */}
      <div className="hero-amount-wrapper">
        <h1 className="hero-amount tabular-nums">
          {formatCurrency(animatedTotal)}
        </h1>
      </div>

      {/* 3 Stat Chips */}
      <div className="hero-stats-grid">
        <StatChip 
          icon="📝" 
          label="Total Transactions" 
          value={count} 
          isInteger={true} 
        />
        <StatChip 
          icon="📊" 
          label="Average Expense" 
          value={averageAmount} 
          isCurrency={true} 
        />
        <StatChip 
          icon="🏆" 
          label="Biggest Expense" 
          value={biggestExpense} 
          isCurrency={true} 
        />
      </div>
    </section>
  );
}
