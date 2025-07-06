import { supabase } from "@/lib/supabaseClient";

export async function getSmartSummary() {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*");

  if (incomeErr) return "⚠️ Failed to fetch income data.";

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*");

  if (expenseErr) return "⚠️ Failed to fetch expense data.";

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const topExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

  return `📊 Smart Summary:
- Total Income: ₹${totalIncome}
- Total Expense: ₹${totalExpense}
- Highest Expense: ${topExpense?.name || "N/A"} (₹${topExpense?.amount || 0})
- Balance: ₹${totalIncome - totalExpense}`;
}
