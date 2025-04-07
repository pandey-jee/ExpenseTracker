import React from 'react';
import { currencies } from '../utils/currencies';

export function CurrencySelector({ selectedCurrency, onCurrencyChange }) {
  return (
    <div>
      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
        Currency
      </label>
      <select
        id="currency"
        value={selectedCurrency.code}
        onChange={(e) => {
          const currency = currencies.find((c) => c.code === e.target.value);
          if (currency) onCurrencyChange(currency);
        }}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}
