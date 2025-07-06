import { supabase } from "@/lib/supabaseClient";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies as getCookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: income, error: incomeError } = await supabase
    .from("incomes")
    .select("*");

  const { data: expenses, error: expenseError } = await supabase
    .from("expenses")
    .select("*");

  if (incomeError || expenseError) {
    return NextResponse.json(
      {
        income: income || [],
        expenses: expenses || [],
        error: incomeError?.message || expenseError?.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    income,
    expenses: expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  });
}
