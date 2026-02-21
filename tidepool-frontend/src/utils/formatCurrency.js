export function formatCurrency(cents, currency = 'GBP') {
  const amount = cents / 100;
  const symbols = { GBP: '\u00A3', USD: '$', EUR: '\u20AC' };
  const symbol = symbols[currency] || '\u00A3';

  if (amount >= 1000) {
    return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatCurrencyFull(cents, currency = 'GBP') {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
