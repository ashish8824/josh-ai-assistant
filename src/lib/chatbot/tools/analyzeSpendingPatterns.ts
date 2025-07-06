import { supabase } from "@/lib/supabaseClient";

export async function analyzeSpendingPatterns() {
  // const user = await supabase.auth.getUser();
  // const user_id = user.data?.user?.id;

  const { data: expenses, error } = await supabase.from("expenses").select("*");

  if (error || !expenses) return "⚠️ Failed to fetch expense data.";

  if (expenses.length === 0) return "📭 No expenses to analyze.";

  const weekdays = Array(7).fill(0); // Sunday (0) to Saturday (6)
  const dayBuckets = { early: 0, mid: 0, late: 0 };
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((e) => {
    const date = new Date(e.date);
    const weekday = date.getDay();
    const dayOfMonth = date.getDate();

    weekdays[weekday] += e.amount;

    if (dayOfMonth <= 10) dayBuckets.early += e.amount;
    else if (dayOfMonth <= 20) dayBuckets.mid += e.amount;
    else dayBuckets.late += e.amount;

    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const mostSpentWeekday = weekdays.indexOf(Math.max(...weekdays));
  const dayTrend =
    dayBuckets.early > dayBuckets.mid && dayBuckets.early > dayBuckets.late
      ? "early-month"
      : dayBuckets.mid > dayBuckets.late
      ? "mid-month"
      : "end-of-month";

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return `🔍 Spending Pattern Insights:
- You spend the most on ${
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][mostSpentWeekday]
  }s.
- Most of your spending happens in the **${dayTrend}**.
- Top category: **${topCategory?.[0]}** (₹${topCategory?.[1]}).`;
}
