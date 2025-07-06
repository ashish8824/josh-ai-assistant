import { supabase } from "@/lib/supabaseClient";

export async function filterExpenses({ category }: { category: string }) {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("category", category);

  if (error || !expenses.length) {
    return `📭 No expenses found for category "${category}".`;
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const list = expenses
    .map(
      (e) =>
        `• ${e.name} — ₹${e.amount} on ${new Date(e.date).toLocaleDateString(
          "en-IN"
        )}`
    )
    .join("\n");

  return `📂 Expenses in "${category}" (${expenses.length} items, ₹${total}):\n${list}`;
}
