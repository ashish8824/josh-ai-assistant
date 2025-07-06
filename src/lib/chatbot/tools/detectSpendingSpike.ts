import { supabase } from "@/lib/supabaseClient";

export async function detectSpendingSpike(): Promise<string> {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Utility to get start and end of month
  const getMonthRange = (year: number, month: number) => {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  };

  const currentRange = getMonthRange(currentYear, currentMonth);

  // Last 3 months range
  const pastMonths = [];
  for (let i = 1; i <= 3; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    pastMonths.push(getMonthRange(date.getFullYear(), date.getMonth()));
  }

  // Fetch current month expenses
  const { data: currentExpenses, error: currErr } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", currentRange.from)
    .lte("date", currentRange.to);

  if (currErr) return "⚠️ Failed to fetch current month expenses.";

  const categoryCurrent: Record<string, number> = {};
  currentExpenses.forEach((e) => {
    categoryCurrent[e.category] = (categoryCurrent[e.category] || 0) + e.amount;
  });

  // Fetch past 3 months expenses
  let pastExpenses: any[] = [];
  for (const range of pastMonths) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("date", range.from)
      .lte("date", range.to);
    if (!error && data) {
      pastExpenses = pastExpenses.concat(data);
    }
  }

  const categoryPast: Record<string, { sum: number; count: number }> = {};
  pastExpenses.forEach((e) => {
    if (!categoryPast[e.category]) {
      categoryPast[e.category] = { sum: 0, count: 0 };
    }
    categoryPast[e.category].sum += e.amount;
    categoryPast[e.category].count++;
  });

  const spikes: string[] = [];

  for (const category in categoryCurrent) {
    const current = categoryCurrent[category];
    const pastAvg =
      categoryPast[category]?.sum / Math.max(categoryPast[category].count, 1) ||
      0;

    if (current > pastAvg * 1.5 && current > 1000) {
      spikes.push(
        `⚠️ Category "${category}" shows a spike: ₹${current} vs past avg ₹${pastAvg.toFixed(
          0
        )}`
      );
    }
  }

  if (spikes.length === 0) {
    return "✅ No significant spikes detected this month. Spending is stable across categories.";
  }

  return `🚨 Spending Spike Detected:\n${spikes.join("\n")}`;
}
