import { supabase } from "@/lib/supabaseClient";

export async function setMonthlyBudget({
  category,
  amount,
}: {
  category: string;
  amount: string;
}) {
  const user = await supabase.auth.getUser();
  const user_id = user.data?.user?.id;
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return `⚠️ Invalid amount: "${amount}". Please enter a valid number.`;
  }

  const now = new Date();
  const month = now.toISOString().slice(0, 7); // e.g. '2025-07'

  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      { category, month, amount: parsedAmount },
      { onConflict: "category,month" }
    );

  if (error) {
    console.error("❌ Supabase error in setMonthlyBudget:", error);
    return `❌ Failed to set budget for "${category}": ${error.message}`;
  }

  return `📌 Budget of ₹${parsedAmount} set for "${category}" this month (${month}).`;
}
