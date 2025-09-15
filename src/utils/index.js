// Utility functions for the application

export function createPageUrl(pageName) {
  const routes = {
    'Home': '/',
    'Challenges': '/challenges',
    'Dashboard': '/dashboard'
  };
  return routes[pageName] || '/';
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatPercentage(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
