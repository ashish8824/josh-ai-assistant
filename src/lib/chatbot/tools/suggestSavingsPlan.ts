import { supabase } from "@/lib/supabaseClient";

export async function suggestSavingsPlan(): Promise<string> {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setMonth(today.getMonth() - 3); // last 3 months

  const from = pastDate.toISOString().slice(0, 10);
  const to = today.toISOString().slice(0, 10);

  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*")
    .gte("date", from)
    .lte("date", to);

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", from)
    .lte("date", to);

  if (incomeErr || expenseErr || !incomes || !expenses) {
    return "⚠️ Failed to analyze your savings due to a data error.";
  }

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const avgIncome = totalIncome / 3;
  const avgExpense = totalExpense / 3;

  const possibleSaving = avgIncome - avgExpense;
  const savingTarget = Math.max(0, Math.floor(possibleSaving * 0.8));

  const advice =
    savingTarget > 0
      ? `💡 You can safely try saving around ₹${savingTarget} per month.`
      : `⚠️ You're currently spending more than you earn. Try to reduce discretionary expenses.`;

  return `📈 Savings Plan (Based on last 3 months):
- Average Monthly Income: ₹${Math.round(avgIncome)}
- Average Monthly Expenses: ₹${Math.round(avgExpense)}
${advice}`;
}
