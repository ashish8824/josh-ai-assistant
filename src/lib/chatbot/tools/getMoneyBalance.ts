import { supabase } from "@/lib/supabaseClient";

export async function getMoneyBalance() {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*");

  if (incomeErr || !incomes) {
    return "⚠️ Failed to fetch incomes.";
  }

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*");

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  return `💰 Your current balance is ₹${totalIncome - totalExpense}`;
}
