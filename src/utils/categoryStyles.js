// Category visual definitions: emoji, color palettes for light and dark modes
export const CATEGORY_STYLES = {
  Food: {
    emoji: '🍔',
    color: '#f97316', // Vibrant Orange
    bgLight: 'rgba(249, 115, 22, 0.12)',
    bgDark: 'rgba(249, 115, 22, 0.22)',
    border: 'rgba(249, 115, 22, 0.35)',
  },
  Transport: {
    emoji: '🚌',
    color: '#0284c7', // Sky Blue
    bgLight: 'rgba(2, 132, 199, 0.12)',
    bgDark: 'rgba(2, 132, 199, 0.22)',
    border: 'rgba(2, 132, 199, 0.35)',
  },
  Bills: {
    emoji: '🧾',
    color: '#64748b', // Slate
    bgLight: 'rgba(100, 116, 139, 0.12)',
    bgDark: 'rgba(100, 116, 139, 0.22)',
    border: 'rgba(100, 116, 139, 0.35)',
  },
  Shopping: {
    emoji: '🛍️',
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.12)',
    bgDark: 'rgba(236, 72, 153, 0.22)',
    border: 'rgba(236, 72, 153, 0.35)',
  },
  Health: {
    emoji: '💊',
    color: '#10b981', // Emerald Green
    bgLight: 'rgba(16, 185, 129, 0.12)',
    bgDark: 'rgba(16, 185, 129, 0.22)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  Entertainment: {
    emoji: '🎬',
    color: '#8b5cf6', // Indigo / Purple
    bgLight: 'rgba(139, 92, 246, 0.12)',
    bgDark: 'rgba(139, 92, 246, 0.22)',
    border: 'rgba(139, 92, 246, 0.35)',
  },
  Other: {
    emoji: '📦',
    color: '#94a3b8', // Neutral Slate / Gray
    bgLight: 'rgba(148, 163, 184, 0.14)',
    bgDark: 'rgba(148, 163, 184, 0.22)',
    border: 'rgba(148, 163, 184, 0.35)',
  },
};

// Fallback style for unknown or custom categories
export const DEFAULT_CATEGORY_STYLE = {
  emoji: '🏷️',
  color: '#6366f1',
  bgLight: 'rgba(99, 102, 241, 0.12)',
  bgDark: 'rgba(99, 102, 241, 0.22)',
  border: 'rgba(99, 102, 241, 0.35)',
};

/**
 * Returns the style configuration for a given category name
 * @param {string} category 
 * @returns {{ emoji: string, color: string, bgLight: string, bgDark: string, border: string }}
 */
export const getCategoryStyle = (category) => {
  return CATEGORY_STYLES[category] || DEFAULT_CATEGORY_STYLE;
};
