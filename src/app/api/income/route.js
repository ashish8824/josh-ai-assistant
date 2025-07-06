import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { amount, source, date, note } = await req.json();

  const { data, error } = await supabase
    .from("income")
    .insert([{ amount, source, date, note }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ income: data }, { status: 200 });
}

export async function GET() {
  const { data, error } = await supabase
    .from("income")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ income: data });
}
