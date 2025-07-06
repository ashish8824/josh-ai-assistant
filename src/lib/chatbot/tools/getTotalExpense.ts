import { supabase } from "@/lib/supabaseClient";

export async function getTotalExpense({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", from)
    .lte("date", to);

  if (error || !expenses) {
    return `⚠️ Couldn't fetch expense data for the given range.`;
  }

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  const breakdown = expenses
    .map(
      (e) =>
        `• ${e.name} — ₹${e.amount} (${e.category}) on ${new Date(
          e.date
        ).toLocaleDateString("en-IN")}`
    )
    .join("\n");

  return `📅 Expense Summary (${from} to ${to}):
Total: ₹${total}
Breakdown:
${breakdown}`;
}
