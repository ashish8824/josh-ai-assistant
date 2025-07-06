// src/components/ExpenseList.tsx
"use client";
import { useFinance } from "@/contexts/FinanceContext";

export default function ExpenseList() {
  const { expenses } = useFinance();

  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text mb-4">Recent Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((expense, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="py-2 text-gray-700">{expense.date}</td>
                <td className="py-2 text-gray-700">{expense.category}</td>
                <td className="py-2 text-red-500 font-semibold">
                  ₹{expense.amount}
                </td>
                <td className="py-2 text-gray-600">{expense.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
