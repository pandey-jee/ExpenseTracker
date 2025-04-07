export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.14 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.89 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.23 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.03 }, // Added INR
];

export function findCurrency(code) {
  return currencies.find(c => c.code === code) || currencies[0]; // Default to USD if currency not found
}

export function convertCurrency(amount, fromCurrency, toCurrency) {
  // Ensure we have valid currencies and amount
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 0;
  }
  
  const from = fromCurrency || currencies[0];
  const to = toCurrency || currencies[0];
  
  const amountInUSD = amount / from.rate;
  return amountInUSD * to.rate;
}

export function formatCurrency(amount, currency) {
  // Handle invalid amount
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }
  
  // Default to USD if currency is undefined
  const curr = currency || currencies[0];
  return `${curr.symbol}${amount.toFixed(2)}`;
}
