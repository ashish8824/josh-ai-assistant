import { supabase } from "@/lib/supabaseClient";

export async function listExpenses() {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) return "⚠️ Failed to fetch expenses.";

  if (!expenses || expenses.length === 0) return "📭 No expenses found yet.";

  const formatted = expenses
    .map(
      (e) =>
        `• ${e.name} — ₹${e.amount} (${e.category}) on ${new Date(
          e.date
        ).toLocaleDateString("en-IN")}`
    )
    .join("\n");

  return `🧾 Here's a list of your recent expenses:\n${formatted}`;
}
