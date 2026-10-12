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

// Returns yesterday's date in YYYY-MM-DD format
export const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Formats month and year to a human-readable string (e.g., "October 2026")
export const formatMonthLabel = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Calculates total spent in the previous calendar month
export const getPreviousMonthTotal = (expenses, currentYear, currentMonth) => {
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }
  const prevExpenses = filterByMonth(expenses, prevYear, prevMonth);
  return getMonthTotal(prevExpenses);
};

// Calculates percentage change between two totals. Returns null if previous total was 0
export const getPercentChange = (currentTotal, previousTotal) => {
  if (previousTotal <= 0) return null;
  const change = ((currentTotal - previousTotal) / previousTotal) * 100;
  return Math.round(change * 10) / 10; // Rounded to 1 decimal place
};

// Human-friendly date heading label
export const formatDateHeading = (dateStr) => {
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  if (dateStr === todayStr) {
    return 'Today';
  }
  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  // Parse date safely without timezone offset problems
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    const currentYear = new Date().getFullYear();

    if (year === currentYear) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return dateStr;
};

// Groups expenses by date string, sorted newest date to oldest
export const groupByDate = (expenses) => {
  const groups = {};

  expenses.forEach(exp => {
    if (!groups[exp.date]) {
      groups[exp.date] = [];
    }
    groups[exp.date].push(exp);
  });

  // Return array of objects: { date, label, items }
  return Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1)) // Newest date first
    .map(dateKey => ({
      date: dateKey,
      label: formatDateHeading(dateKey),
      items: groups[dateKey]
    }));
};

// Sorts expenses based on chosen criteria
export const sortExpenses = (expenses, sortBy = 'newest') => {
  const copy = [...expenses];
  switch (sortBy) {
    case 'oldest':
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case 'highest':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'lowest':
      return copy.sort((a, b) => a.amount - b.amount);
    case 'newest':
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date));
  }
};
