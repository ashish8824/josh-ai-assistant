"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useUser } from "@/context/UserContext";
import { useUser } from "@/contexts/UserContext";

import AddExpenseForm from "@/components/AddExpenseForm";
import BalanceCard from "@/components/BalanceCard";
import ExpenseList from "@/components/ExpenseList";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import ExpenseHistory from "@/components/ExpenseHistory";
import TrendsChart from "@/components/TrendChart";
import { FinanceProvider } from "@/contexts/FinanceContext";
import MonthlyIncomeVsExpenseChart from "@/components/MonthlyTrend";

export default function DashboardPage() {
  const [chatOpen, setChatOpen] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  if (!user) return null; // Prevent flash of unauth content

  return (
    <FinanceProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            chatOpen ? "mr-[28rem]" : ""
          }`}
        >
          <Topbar />

          <main className="p-6 space-y-6 overflow-y-auto scroll-smooth flex-1">
            <div id="balance">
              <BalanceCard />
            </div>

            <div id="toggle-add-expense" className="mb-2">
              <button
                onClick={() => setShowAddExpense((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                {showAddExpense ? "Hide Add Expense" : "Add New Expense"}
              </button>
            </div>

            {showAddExpense && (
              <div id="add-expense">
                <AddExpenseForm />
              </div>
            )}

            <div id="expense-list">
              <ExpenseList />
            </div>

            <div id="expense-history">
              <ExpenseHistory />
            </div>

            <div id="trends">
              <TrendsChart />
            </div>

            <div id="smart-summary">
              <MonthlyIncomeVsExpenseChart />
            </div>
          </main>
        </div>

        {/* ChatBot */}
        {chatOpen && (
          <div className="fixed bottom-4 right-4 z-50 w-[28rem] max-w-full">
            <ChatWindow onClose={() => setChatOpen(false)} />
          </div>
        )}
      </div>
    </FinanceProvider>
  );
}
