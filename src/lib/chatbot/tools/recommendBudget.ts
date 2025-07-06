// lib/tools/recommendBudget.ts

import { supabase } from "@/lib/supabaseClient";

export async function recommendBudget({
  category,
}: {
  category: string;
}): Promise<string> {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  if (!category) return "⚠️ Please provide a category.";

  const today = new Date();
  const oneYearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  ).toISOString();

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("category", category)
    .gte("date", oneYearAgo);

  if (error || !expenses || expenses.length === 0) {
    return `📭 No past expenses found for category "${category}".`;
  }

  const monthlyBreakdown = new Map<string, number>();

  for (const exp of expenses) {
    const month = new Date(exp.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    monthlyBreakdown.set(
      month,
      (monthlyBreakdown.get(month) || 0) + exp.amount
    );
  }

  const amounts = Array.from(monthlyBreakdown.values());
  const average = Math.round(
    amounts.reduce((a, b) => a + b, 0) / amounts.length
  );

  return `📈 Based on your past ${
    amounts.length
  } months of "${category}" expenses, a recommended monthly budget is: ₹${average.toLocaleString(
    "en-IN"
  )}.`;
}
