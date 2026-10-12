import React, { useState, useEffect } from 'react';
import { getCategoryStyle } from '../utils/categoryStyles';
import { formatCurrency } from '../utils/helpers';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ categoryTotals, totalSpent, hoveredCategory, onHoverCategory }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger smooth stroke-dasharray drawing animation
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [categoryTotals]);

  // If no spending, render soft empty state ring
  if (!categoryTotals || categoryTotals.length === 0 || totalSpent <= 0) {
    return (
      <div className="donut-chart-container empty-donut-container">
        <svg viewBox="0 0 200 200" className="donut-svg" aria-label="Empty chart ring">
          {/* Subtle background track */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="20"
            strokeDasharray="6 6"
          />
        </svg>
        <div className="donut-center-content">
          <span className="empty-donut-emoji" aria-hidden="true">📊</span>
          <span className="empty-donut-text">Add an expense to see your chart</span>
        </div>
      </div>
    );
  }

  // Calculate slice geometry functionally using reduce without outer variable reassignments
  const { slices } = categoryTotals.reduce(
    (acc, item) => {
      const fraction = item.total / totalSpent;
      const arcLength = fraction * CIRCUMFERENCE;
      // Tiny gap between slices if multiple categories exist
      const gap = categoryTotals.length > 1 ? 2.5 : 0;
      const visibleLength = Math.max(0, arcLength - gap);
      const offset = -acc.accumulated;
      const style = getCategoryStyle(item.category);
      const isHovered = hoveredCategory === item.category;
      const isDimmed = hoveredCategory && hoveredCategory !== item.category;

      acc.slices.push({
        category: item.category,
        total: item.total,
        fraction,
        percentage: Math.round(fraction * 100),
        arcLength: visibleLength,
        offset,
        color: style.color,
        isHovered,
        isDimmed
      });

      acc.accumulated += arcLength;
      return acc;
    },
    { accumulated: 0, slices: [] }
  );

  return (
    <div className="donut-chart-container">
      <svg 
        viewBox="0 0 200 200" 
        className="donut-svg" 
        role="img" 
        aria-label={`Donut chart of spending across ${categoryTotals.length} categories`}
      >
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="var(--surface-alt)"
          strokeWidth="22"
        />

        {/* Dynamic Slices */}
        <g transform="rotate(-90 100 100)">
          {slices.map((slice) => (
            <circle
              key={slice.category}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={slice.color}
              strokeWidth={slice.isHovered ? 26 : 22}
              strokeDasharray={animated ? `${slice.arcLength} ${CIRCUMFERENCE}` : `0 ${CIRCUMFERENCE}`}
              strokeDashoffset={slice.offset}
              strokeLinecap="round"
              className={`donut-slice ${slice.isHovered ? 'slice-hovered' : ''} ${slice.isDimmed ? 'slice-dimmed' : ''}`}
              onMouseEnter={() => onHoverCategory(slice.category)}
              onMouseLeave={() => onHoverCategory(null)}
              cursor="pointer"
            >
              <title>{`${slice.category}: ${formatCurrency(slice.total)} (${slice.percentage}%)`}</title>
            </circle>
          ))}
        </g>
      </svg>

      {/* Center of the Donut */}
      <div className="donut-center-content">
        <span className="donut-center-label">Total Spent</span>
        <span className="donut-center-total tabular-nums">{formatCurrency(totalSpent)}</span>
        {hoveredCategory && (
          <span className="donut-center-hovered-badge">
            {hoveredCategory}
          </span>
        )}
      </div>
    </div>
  );
}
