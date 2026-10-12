import React from 'react';
import { CATEGORIES } from '../utils/constants';
import { getCategoryStyle } from '../utils/categoryStyles';

export default function CategoryChips({ selectedCategory, onSelectCategory, categoryCounts = {} }) {
  return (
    <div 
      className="category-chips-scroll-container" 
      role="region" 
      aria-label="Filter expenses by category"
    >
      <div className="category-chips-track">
        {/* 'All' category option */}
        <button
          type="button"
          className={`filter-chip ${selectedCategory === 'All' ? 'active active-all' : ''}`}
          onClick={() => onSelectCategory('All')}
          aria-pressed={selectedCategory === 'All'}
        >
          <span className="filter-chip-emoji" aria-hidden="true">✨</span>
          <span className="filter-chip-text">All</span>
          {categoryCounts['All'] !== undefined && (
            <span className="filter-chip-count">{categoryCounts['All']}</span>
          )}
        </button>

        {/* Individual category options */}
        {CATEGORIES.map((cat) => {
          const style = getCategoryStyle(cat);
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
              aria-pressed={isSelected}
              style={{
                '--chip-color': style.color,
                '--chip-bg': isSelected ? style.color : style.bgLight,
                '--chip-text': isSelected ? '#ffffff' : 'inherit',
              }}
            >
              <span className="filter-chip-emoji" aria-hidden="true">{style.emoji}</span>
              <span className="filter-chip-text">{cat}</span>
              {count > 0 && (
                <span className="filter-chip-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
