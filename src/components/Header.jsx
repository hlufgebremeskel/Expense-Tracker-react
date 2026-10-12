import React from 'react';
import ThemeToggle from './ThemeToggle';
import { formatMonthLabel } from '../utils/helpers';

export default function Header({ year, month, onChangeMonth }) {
  return (
    <header className="app-header card">
      <div className="header-brand">
        <div className="brand-logo" aria-hidden="true">
          <span>💸</span>
        </div>
        <div className="brand-text">
          <span className="brand-title">Expense Tracker</span>
          <span className="brand-tagline">Personal Finance</span>
        </div>
      </div>

      {/* Pill-shaped Month Switcher */}
      <nav className="month-switcher-pill" aria-label="Month navigation">
        <button 
          type="button"
          onClick={() => onChangeMonth(-1)} 
          aria-label="Go to previous month"
          className="month-nav-btn"
          title="Previous month"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <span className="month-display" aria-live="polite">
          {formatMonthLabel(year, month)}
        </span>

        <button 
          type="button"
          onClick={() => onChangeMonth(1)} 
          aria-label="Go to next month"
          className="month-nav-btn"
          title="Next month"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </nav>

      {/* Header controls: Theme Toggle */}
      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
