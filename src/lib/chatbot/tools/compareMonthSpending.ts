import { supabase } from "@/lib/supabaseClient";

export async function compareMonthSpending(): Promise<string> {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const getMonthRange = (year: number, month: number) => {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  };

  const currentRange = getMonthRange(currentYear, currentMonth);
  const lastRange = getMonthRange(lastMonthYear, lastMonth);

  const [currentExpensesRes, lastExpensesRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .gte("date", currentRange.from)
      .lte("date", currentRange.to),
    supabase
      .from("expenses")
      .select("*")
      .gte("date", lastRange.from)
      .lte("date", lastRange.to),
  ]);

  if (currentExpensesRes.error || lastExpensesRes.error) {
    return "⚠️ Could not fetch expense data for comparison.";
  }

  const currentTotal = currentExpensesRes.data.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const lastTotal = lastExpensesRes.data.reduce((sum, e) => sum + e.amount, 0);

  const diff = currentTotal - lastTotal;
  const percent = lastTotal > 0 ? ((diff / lastTotal) * 100).toFixed(1) : "N/A";

  let analysis = "";

  if (diff > 0) {
    analysis = `🔺 You spent ₹${diff} more this month (${percent}% increase). Try reviewing your top categories.`;
  } else if (diff < 0) {
    analysis = `✅ Great! You spent ₹${Math.abs(
      diff
    )} less this month (${Math.abs(+percent)}% decrease). Keep it up!`;
  } else {
    analysis = `🔄 Your spending stayed the same across both months.`;
  }

  return `📊 Spending Comparison:
- This month: ₹${currentTotal}
- Last month: ₹${lastTotal}
${analysis}`;
}
