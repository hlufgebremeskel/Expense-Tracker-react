import React, { useState } from 'react';
import DonutChart from './DonutChart';
import { getCategoryStyle } from '../utils/categoryStyles';
import { formatCurrency } from '../utils/helpers';

export default function ExpenseChart({ categoryTotals }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Compute total spent across all categories
  const totalSpent = categoryTotals.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="expense-chart card">
      <div className="chart-card-header">
        <h2>Category Breakdown</h2>
        <span className="chart-header-badge">
          {categoryTotals.length} {categoryTotals.length === 1 ? 'Category' : 'Categories'}
        </span>
      </div>

      {/* Donut Chart Visual */}
      <DonutChart
        categoryTotals={categoryTotals}
        totalSpent={totalSpent}
        hoveredCategory={hoveredCategory}
        onHoverCategory={setHoveredCategory}
      />

      {/* Legend with Category Breakdown and Animated Progress Bars */}
      {categoryTotals.length > 0 && (
        <div className="chart-legend-list" role="list">
          {categoryTotals.map(({ category, total }) => {
            const style = getCategoryStyle(category);
            const percentage = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
            const isHovered = hoveredCategory === category;
            const isDimmed = hoveredCategory && hoveredCategory !== category;

            return (
              <div
                key={category}
                className={`legend-row ${isHovered ? 'legend-hovered' : ''} ${isDimmed ? 'legend-dimmed' : ''}`}
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
                role="listitem"
                tabIndex="0"
                onFocus={() => setHoveredCategory(category)}
                onBlur={() => setHoveredCategory(null)}
              >
                {/* Header row: Emoji, Name, Percentage, and Amount */}
                <div className="legend-row-top">
                  <div className="legend-category-info">
                    <span className="legend-emoji" aria-hidden="true">{style.emoji}</span>
                    <span className="legend-name">{category}</span>
                  </div>
                  <div className="legend-metrics">
                    <span className="legend-percentage tabular-nums">{percentage}%</span>
                    <span className="legend-amount tabular-nums">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Horizontal Progress Bar for Category */}
                <div className="legend-progress-track">
                  <div
                    className="legend-progress-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: style.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
