import { supabase } from "@/lib/supabaseClient";

export async function categorizeRecurringExpenses(): Promise<string> {
  // const user = await supabase.auth.getUser();
  // const user_id = user.data?.user?.id;

  const { data: expenses, error } = await supabase.from("expenses").select("*");

  if (error || !expenses) return "⚠️ Failed to fetch expenses.";

  // Group by name-category combo
  const grouped: Record<
    string,
    { total: number; count: number; dates: string[] }
  > = {};

  for (const exp of expenses) {
    const key = `${exp.name}-${exp.category}`;
    if (!grouped[key]) {
      grouped[key] = { total: 0, count: 0, dates: [] };
    }
    grouped[key].total += exp.amount;
    grouped[key].count++;
    grouped[key].dates.push(exp.date);
  }

  const recurring = Object.entries(grouped)
    .filter(([_, v]) => v.count >= 3) // Occurs at least 3 times
    .map(([k, v]) => {
      const avg = Math.round(v.total / v.count);
      const [name, category] = k.split("-");
      return `• ${name} (${category}) — ₹${avg}/month, repeated ${v.count} times`;
    });

  if (recurring.length === 0)
    return "📭 No recurring expenses detected yet. Josh will notify you once enough data is available.";

  return `🔁 Recurring Monthly Expenses:\n${recurring.join("\n")}`;
}
