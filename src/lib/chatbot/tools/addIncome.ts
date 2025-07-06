import { supabase } from "@/lib/supabaseClient";

export async function addIncome({
  name,
  amount,
}: {
  name: string;
  amount: string;
}) {
  console.log("addincme");

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return `⚠️ Invalid income amount: "${amount}".`;
  }

  const { data, error } = await supabase
    .from("incomes")
    .insert({
      name,
      amount: parsedAmount,
      date: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error("❌ Supabase income insert error:", error);
    return `❌ Failed to save income: ${error.message}`;
  }

  return `✅ Income "${name}" of ₹${parsedAmount} recorded.`;
}
