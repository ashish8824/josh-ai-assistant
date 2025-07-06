// src/components/ExpenseHistory.tsx
"use client";
import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function ExpenseHistory() {
  const { expenses } = useFinance();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExpenses = expenses.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-text mb-4">
        📄 Expense History
      </h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses yet.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {currentExpenses.map((exp, idx) => (
              <li
                key={startIdx + idx}
                className="flex justify-between border-b pb-1 text-sm text-gray-700"
              >
                <span>{exp.name}</span>
                <span>₹{exp.amount}</span>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
