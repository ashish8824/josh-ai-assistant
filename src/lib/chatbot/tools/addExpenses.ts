import { supabase } from "@/lib/supabaseClient";

export async function addExpense({
  name,
  amount,
  category,
  date,
  note,
}: {
  name: string;
  amount: string;
  category?: string;
  date?: string;
  note?: string;
}) {
  // const user = await supabase.auth.getUser();
  // const user_id = user.data?.user?.id;
  // console.log("userid inside addexpense tools", user_id);

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return `⚠️ Invalid expense amount: "${amount}". Please provide a number greater than 0.`;
  }

  const { error, data } = await supabase.from("expenses").insert({
    name,
    amount: parsedAmount,
    category: category || "Uncategorized",
    date: date || new Date().toISOString(),
    note: note || "",
  });

  if (error) {
    return `❌ Failed to save expense: ${error.message}`;
  }

  console.log("data=>>>>>>", data);

  return `✅ Expense "${name}" of ₹${parsedAmount} added to "${category}" on ${
    date || "today"
  }.`;
}
