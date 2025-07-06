// lib/tools/suggestInvestmentPercentage.ts

import { supabase } from "@/lib/supabaseClient";

export async function suggestInvestmentPercentage(): Promise<string> {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*");

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*");

  if (incomeErr || !incomes || incomes.length === 0)
    return "⚠️ No income records found.";
  if (expenseErr || !expenses) return "⚠️ Unable to evaluate expenses.";

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const incomeStability =
    incomes.length >= 6 ? "stable" : incomes.length >= 3 ? "moderate" : "low";

  let suggestedPercentage = 10;

  if (incomeStability === "stable") {
    suggestedPercentage = balance > totalIncome * 0.3 ? 30 : 20;
  } else if (incomeStability === "moderate") {
    suggestedPercentage = 15;
  } else {
    suggestedPercentage = 10;
  }

  const investAmount = Math.round((totalIncome * suggestedPercentage) / 100);

  return `💡 Based on your income history (${incomeStability}) and current spending:
You can safely invest **${suggestedPercentage}%** of your income (~₹${investAmount.toLocaleString(
    "en-IN"
  )}).
This will help grow your wealth while maintaining financial safety.`;
}
