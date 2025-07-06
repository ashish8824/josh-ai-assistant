import { supabase } from "@/lib/supabaseClient";

export async function getBudgetStatus() {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const month = new Date().toISOString().slice(0, 7); // '2025-07'

  const { data: budgets, error: budgetErr } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", month);

  if (budgetErr || !budgets?.length) {
    return "⚠️ No budgets found for this month. Use 'setMonthlyBudget' to define your spending goals.";
  }

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`);

  if (expenseErr) return "⚠️ Failed to fetch expenses for budget analysis.";

  const categoryTotals: Record<string, number> = {};
  for (const e of expenses || []) {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  }

  const summary = budgets.map((b) => {
    const spent = categoryTotals[b.category] || 0;
    const percent = ((spent / b.amount) * 100).toFixed(1);
    const status =
      spent > b.amount
        ? "🚨 Over Budget"
        : spent > b.amount * 0.8
        ? "⚠️ Near Limit"
        : "✅ Within Limit";

    return `• ${b.category}: Spent ₹${spent} of ₹${b.amount} (${percent}%) — ${status}`;
  });

  return `📊 Budget Status for ${month}:\n${summary.join("\n")}`;
}
