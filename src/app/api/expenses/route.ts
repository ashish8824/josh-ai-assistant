import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, amount, category, date, note } = body;

  const { data, error } = await supabase.from("expenses").insert({
    name,
    amount,
    category,
    date,
    note,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
