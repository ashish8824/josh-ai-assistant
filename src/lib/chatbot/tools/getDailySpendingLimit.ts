// lib/tools/getDailySpendingLimit.ts

import { supabase } from "@/lib/supabaseClient";

export async function getDailySpendingLimit(): Promise<string> {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentYear = now.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).toISOString();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).toISOString();
  const today = now.getDate();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = totalDays - today;

  // Fetch all income for the month
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*")
    .gte("date", firstDay)
    .lte("date", lastDay);

  if (incomeErr) return "⚠️ Failed to fetch income data.";

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  // Fetch all expenses for the month
  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", firstDay)
    .lte("date", lastDay);

  if (expenseErr) return "⚠️ Failed to fetch expense data.";

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalIncome - totalExpense;

  if (remainingBudget <= 0) {
    return `🚨 You've already spent more than your income for this month. Try reducing expenses.`;
  }

  const dailyLimit = Math.floor(remainingBudget / remainingDays);

  return `📅 You have ₹${remainingBudget.toLocaleString(
    "en-IN"
  )} remaining for this month.
You can safely spend up to ₹${dailyLimit.toLocaleString(
    "en-IN"
  )} per day for the remaining ${remainingDays} days.`;
}
