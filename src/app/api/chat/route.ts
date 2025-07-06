import { NextRequest, NextResponse } from "next/server";
import { runChatSession } from "@/lib/chatbot/chatEngine";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const reply = await runChatSession(messages);
  return NextResponse.json({ reply });
}
