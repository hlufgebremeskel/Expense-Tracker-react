import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { formatCurrency } from '../utils/helpers';

/**
 * Reusable stat chip for summary cards
 * Handles count-up animation for numbers/currency
 */
export default function StatChip({ icon, label, value, isCurrency = false, isInteger = false }) {
  const animatedValue = useCountUp(Number(value) || 0, 600);

  let displayValue;
  if (isCurrency) {
    displayValue = formatCurrency(animatedValue);
  } else if (isInteger) {
    displayValue = Math.round(animatedValue).toString();
  } else {
    displayValue = animatedValue.toFixed(1);
  }

  return (
    <div className="stat-chip">
      <span className="stat-chip-icon" aria-hidden="true">{icon}</span>
      <div className="stat-chip-content">
        <span className="stat-chip-label">{label}</span>
        <span className="stat-chip-val tabular-nums">{displayValue}</span>
      </div>
    </div>
  );
}
