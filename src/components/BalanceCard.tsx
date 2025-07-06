// src/components/BalanceCard.tsx
"use client";
import { useFinance } from "@/contexts/FinanceContext";

export default function BalanceCard() {
  const { balance, expenses, income } = useFinance();

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Income</p>
        <p className="text-xl font-bold text-green-600">₹ {totalIncome}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Expenses</p>
        <p className="text-xl font-bold text-red-500">₹ {totalExpense}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Balance</p>
        <p className="text-xl font-bold text-gray-900">₹ {balance}</p>
      </div>
    </div>
  );
}
