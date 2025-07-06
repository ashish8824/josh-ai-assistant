// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { expenseDB } from "@/lib/db"; // keep in-memory for now
import { supabase } from "@/lib/supabaseClient"; // ✅ Supabase client
import { date } from "zod/v4-mini";

const key = process.env.GROQ_API_KEY;
if (!key) throw new Error("❌ GROQ_API_KEY is missing from .env.local");

const groq = new Groq({ apiKey: key });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const now = new Date().toUTCString();

  const sessionMessages = [
    {
      role: "system",
      content: `
      You are Josh, a personal finance assistant for users in India.
      Your tasks include: tracking expenses, managing income, and calculating current balance.
💡    Always format currency using Indian Rupees (₹), NOT dollars. Never use the "$" symbol.

        Example: 
        - Use ₹5,000 instead of $5000.
        - Format numbers like ₹1,000 or ₹50,000 appropriately.

        ✅ You can use the following tools when needed:
        1. getTotalExpense({from, to}): Get user's total expenses in a date range.
        2. addExpense({name, amount, category, date, note}): Add a new expense.
        3. addIncome({name, amount}): Add income and confirm.
        4. getMoneyBalance(): Return user's current balance.
        5. getSmartSummary(): Gives a summary of user’s finances.
        6. listExpenses(): Lists user's recent expenses with name, amount, category, and date.

        📅 Current datetime: ${now}
      `,
    },
    ...messages,
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: sessionMessages,
    tools: [
      {
        type: "function",
        function: {
          name: "getTotalExpense",
          description: "Get total expense from date to date",
          parameters: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "addExpense",
          description: "Add new expense",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              amount: { type: "string" },
              category: { type: "string" },
              date: { type: "string" },
              note: { type: "string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "addIncome",
          description: "Add new income",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              amount: { type: "string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getMoneyBalance",
          description: "Get balance",
        },
      },
      {
        type: "function",
        function: {
          name: "getSmartSummary",
          description: "Provides a smart summary of user’s finances",
        },
      },
      {
        type: "function",
        function: {
          name: "listExpenses",
          description:
            "Lists all past expenses with name, amount, category, and date.",
        },
      },
    ],
  });

  const msg = completion.choices[0].message;
  sessionMessages.push(msg);

  const toolCalls = msg.tool_calls || [];

  for (const tool of toolCalls) {
    const name = tool.function.name;
    let args;

    try {
      args = JSON.parse(tool.function.arguments || "{}");
    } catch (err) {
      sessionMessages.push({
        role: "tool",
        content: `⚠️ Couldn't parse input for ${name}.`,
        tool_call_id: tool.id,
      });
      continue;
    }

    try {
      let result = "";

      switch (name) {
        case "addExpense":
          result = addExpense(args);
          break;
        case "addIncome":
          result = await addIncome(args); // ✅ await Supabase
          break;
        case "getTotalExpense":
          result = getTotalExpense(args);
          break;
        case "getMoneyBalance":
          result = await getMoneyBalance(); // ✅ fetch from Supabase
          break;
        case "getSmartSummary":
          result = await getSmartSummary(); // ✅ fetch from Supabase
          break;
        case "listExpenses":
          result = await listExpenses();
          break;
        default:
          result = `⚠️ Unknown tool name: ${name}`;
      }

      sessionMessages.push({
        role: "tool",
        content: typeof result === "string" ? result : JSON.stringify(result),
        tool_call_id: tool.id,
      });
    } catch (err: any) {
      sessionMessages.push({
        role: "tool",
        content: `⚠️ Error in "${name}": ${err.message}`,
        tool_call_id: tool.id,
      });
    }
  }

  const second = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: sessionMessages,
  });

  return NextResponse.json({ reply: second.choices[0].message.content });
}

// === Tool Functions ===

async function addExpense({
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
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return `⚠️ Invalid expense amount: "${amount}". Please provide a number greater than 0.`;
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      name,
      amount: parsedAmount,
      category: category || "Uncategorized",
      date: date || new Date().toISOString(),
      note: note || "",
    })
    .select();

  if (error) {
    console.error("❌ Supabase expense insert error:", error);
    return `❌ Failed to save expense: ${error.message}`;
  }

  return `✅ Expense "${name}" of ₹${parsedAmount} added to "${category}" on ${
    date || "today"
  }.`;
}

async function addIncome({ name, amount }: { name: string; amount: string }) {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return `⚠️ Invalid income amount: "${amount}". Please provide a valid number.`;
  }

  const { data, error } = await supabase
    .from("incomes")
    .insert({
      name,
      amount: parsedAmount,
      date: new Date().toISOString(),
    })
    .select(); // <--- force return of inserted row

  if (error) {
    console.error("❌ Supabase income insert error:", error);
    return `❌ Failed to save income: ${error.message}`;
  }

  if (!data) {
    console.error(
      "❌ Insert returned null data. Likely wrong table or permissions."
    );
    return "❌ Income was not saved. Please check table name and row permissions.";
  }

  console.log("✅ Supabase income inserted:", data);
  return `✅ Income "${name}" of ₹${parsedAmount} recorded.`;
}

async function getTotalExpense({ from, to }: { from: string; to: string }) {
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

async function getMoneyBalance() {
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*");

  if (incomeErr || !incomes) {
    return "⚠️ Failed to fetch incomes.";
  }

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*");

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  return `💰 Your current balance is ₹${totalIncome - totalExpense}`;
}

async function getSmartSummary() {
  const { data: incomes, error: incomeErr } = await supabase
    .from("incomes")
    .select("*");

  if (incomeErr) return "⚠️ Failed to fetch income data.";

  const { data: expenses, error: expenseErr } = await supabase
    .from("expenses")
    .select("*");

  if (expenseErr) return "⚠️ Failed to fetch expense data.";

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const topExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

  return `📊 Smart Summary:
- Total Income: ₹${totalIncome}
- Total Expense: ₹${totalExpense}
- Highest Expense: ${topExpense?.name || "N/A"} (₹${topExpense?.amount || 0})
- Balance: ₹${totalIncome - totalExpense}`;
}

async function listExpenses() {
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) return "⚠️ Failed to fetch expenses.";

  if (!expenses || expenses.length === 0) return "📭 No expenses found yet.";

  const formatted = expenses
    .map(
      (e) =>
        `• ${e.name} — ₹${e.amount} (${e.category}) on ${new Date(
          e.date
        ).toLocaleDateString("en-IN")}`
    )
    .join("\n");

  return `🧾 Here's a list of your recent expenses:\n${formatted}`;
}
