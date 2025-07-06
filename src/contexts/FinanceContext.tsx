// src/contexts/FinanceContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Expense = {
  name: string;
  amount: number;
  date: string;
  category: string;
  note: string;
};

export type Income = {
  name: string;
  amount: number;
  date: string;
};

type FinanceContextType = {
  expenses: Expense[];
  income: Income[];
  balance: number;
  refreshFinance: () => void;
};

const FinanceContext = createContext<FinanceContextType | null>(null);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  const refreshFinance = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setExpenses(data.expenses || []);
      setIncome(data.income || []);
    } catch (err) {
      console.error("❌ Failed to refresh finance data", err);
    }
  };

  useEffect(() => {
    refreshFinance();
  }, []);

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider
      value={{ expenses, income, balance, refreshFinance }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
