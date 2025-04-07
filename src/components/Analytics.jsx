import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { convertCurrency, formatCurrency, findCurrency } from '../utils/currencies';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export function Analytics({ expenses, selectedCurrency }) {
  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((expense) => {
      const originalCurrency = findCurrency(expense.originalCurrency);
      const convertedAmount = convertCurrency(expense.originalAmount, originalCurrency, selectedCurrency);
      totals[expense.category] = (totals[expense.category] || 0) + convertedAmount;
    });
    return Object.entries(totals).map(([category, total]) => ({ category, total }));
  }, [expenses, selectedCurrency]);

  const monthlyTotals = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date()),
    });

    return last6Months.map((date) => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const total = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      }).reduce((sum, expense) => {
        const originalCurrency = findCurrency(expense.originalCurrency);
        const convertedAmount = convertCurrency(expense.originalAmount, originalCurrency, selectedCurrency);
        return sum + convertedAmount;
      }, 0);

      return { month: format(date, 'MMM yyyy'), total };
    });
  }, [expenses, selectedCurrency]);

  const totalSpent = expenses.reduce((sum, expense) => {
    const originalCurrency = findCurrency(expense.originalCurrency);
    const convertedAmount = convertCurrency(expense.originalAmount, originalCurrency, selectedCurrency);
    return sum + convertedAmount;
  }, 0);

  const averageExpense = totalSpent / (expenses.length || 1);

  const predictNextMonthExpense = () => {
    if (monthlyTotals.length < 2) return averageExpense;
    
    const lastTwoMonths = monthlyTotals.slice(-2);
    const trend = lastTwoMonths[1].total - lastTwoMonths[0].total;
    return Math.max(0, lastTwoMonths[1].total + trend);
  };

  const prediction = predictNextMonthExpense();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Total Spent</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {formatCurrency(totalSpent, selectedCurrency)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Average Expense</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {formatCurrency(averageExpense, selectedCurrency)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Predicted Next Month</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatCurrency(prediction, selectedCurrency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.category}: ${formatCurrency(entry.total, selectedCurrency)}`}
                >
                  {categoryTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, selectedCurrency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTotals}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, selectedCurrency)} />
                <Legend />
                <Bar dataKey="total" name="Total Spent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
