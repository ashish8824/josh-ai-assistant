import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  try {
    // 1. Clear old data
    await supabase.from("budgets").delete().neq("id", "");
    await supabase.from("expenses").delete().neq("id", "");
    await supabase.from("incomes").delete().neq("id", "");

    // 2. Insert test budgets
    // await supabase.from("budgets").insert([
    //   { category: "Food", amount: 8000, month: "2025-07" },
    //   { category: "Transport", amount: 3000, month: "2025-07" },
    // ]);

    // 3. Insert test incomes
    // await supabase.from("incomes").insert([
    //   { name: "Freelance Work", amount: 25000, date: "2025-07-01" },
    //   { name: "Side Hustle", amount: 15000, date: "2025-07-02" },
    // ]);

    // 4. Insert test expenses
    // await supabase.from("expenses").insert([
    //   {
    //     name: "Groceries",
    //     amount: 3200,
    //     category: "Food",
    //     date: "2025-07-03",
    //     note: "Weekly groceries",
    //   },
    //   {
    //     name: "Uber ride",
    //     amount: 800,
    //     category: "Transport",
    //     date: "2025-06-25",
    //     note: "Ride to work",
    //   },
    //   {
    //     name: "Netflix subscription",
    //     amount: 1500,
    //     category: "Entertainment",
    //     date: "2025-07-03",
    //     note: "Monthly subscription",
    //   },
    // ]);

    return NextResponse.json({ message: "✅ Test data seeded successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { error: `❌ Failed to reset database: ${err.message}` },
      { status: 500 }
    );
  }
}
