// Returns only expenses matching the specified year and month
export const filterByMonth = (expenses, year, month) => {
  return expenses.filter(exp => {
    // Parse the date string directly to avoid timezone shift issues
    const [expYear, expMonth] = exp.date.split('-');
    return parseInt(expYear, 10) === year && parseInt(expMonth, 10) === month;
  });
};

// Calculates the total sum of amounts in a given expenses array
export const getMonthTotal = (expenses) => {
  return expenses.reduce((total, exp) => total + exp.amount, 0);
};

// Groups expenses by category and returns them sorted by highest total first
export const groupByCategory = (expenses) => {
  const grouped = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  return Object.keys(grouped)
    .map(category => ({ category, total: grouped[category] }))
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);
};

// Formats a number to USD currency representation
export const formatCurrency = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(number);
};

// Returns today's date in YYYY-MM-DD format for HTML date inputs
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Formats month and year to a human-readable string (e.g., "October 2026")
export const formatMonthLabel = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
