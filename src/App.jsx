import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Analytics } from './components/Analytics';
import { Wallet } from 'lucide-react';
import { currencies } from './utils/currencies';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = localStorage.getItem('selectedCurrency');
    return saved ? JSON.parse(saved) : currencies[0];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
  }, [selectedCurrency]);

  const handleAddExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Wallet className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Expense Tracker</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ExpenseForm
                onAddExpense={handleAddExpense}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Analytics expenses={expenses} selectedCurrency={selectedCurrency} />
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
                selectedCurrency={selectedCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
