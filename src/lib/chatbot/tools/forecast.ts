import { supabase } from "@/lib/supabaseClient";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

export async function forecastSpending() {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const today = new Date();
  const currentMonthKey = getMonthKey(today);

  // Step 1: Fetch last 6 months of expenses
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("amount, date")
    .eq("user_id", user_id)
    .gte("date", sixMonthsAgo.toISOString());

  if (error || !expenses) {
    console.error("❌ Forecast fetch error:", error);
    return "⚠️ Could not fetch past expense data for forecasting.";
  }

  // Step 2: Group by month
  const monthMap: Record<string, number> = {};

  for (const expense of expenses) {
    const date = new Date(expense.date);
    const key = getMonthKey(date);
    monthMap[key] = (monthMap[key] || 0) + expense.amount;
  }

  const sortedKeys = Object.keys(monthMap).sort();
  const data = sortedKeys.map((k, idx) => ({
    x: idx + 1, // time index
    y: monthMap[k],
  }));

  if (data.length < 2) {
    return "📉 Not enough data to forecast. Add more expenses over time.";
  }

  // Step 3: Linear regression: y = a * x + b
  const n = data.length;
  const sumX = data.reduce((acc, p) => acc + p.x, 0);
  const sumY = data.reduce((acc, p) => acc + p.y, 0);
  const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

  const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - a * sumX) / n;

  const predicted = Math.round(a * (n + 1) + b); // Forecast for next (current) month

  // Step 4: Compute current total income
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("amount");

  const totalIncome = incomes?.reduce((sum, i) => sum + i.amount, 0) || 0;
  const estimatedBalance = totalIncome - predicted;

  return `📈 Forecast AI:
- Estimated spending this month: ₹${predicted.toLocaleString("en-IN")}
- Estimated end-of-month balance: ₹${estimatedBalance.toLocaleString("en-IN")}`;
}
