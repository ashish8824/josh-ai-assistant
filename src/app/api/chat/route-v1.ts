// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { expenseDB, incomeDB } from "@/lib/db";

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
💡 Always format currency using Indian Rupees (₹), NOT dollars. Never use the "$" symbol.

Example: 
- Use ₹5000 instead of $5000.
- Format numbers like ₹1,000 or ₹50,000 appropriately.

✅ You can use the following tools when needed:
1. getTotalExpense({from, to}): Get user's total expenses in a date range.
2. addExpense({name, amount, category, date, note}): Add a new expense.
3. addIncome({name, amount}): Add income and confirm.
4. getMoneyBalance(): Return user's current balance.
5. getSmartSummary(): Gives a summary of user’s finances.

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
          result = addIncome(args);
          break;
        case "getTotalExpense":
          result = getTotalExpense(args);
          break;
        case "getMoneyBalance":
          result = getMoneyBalance();
          break;
        case "getSmartSummary":
          result = getSmartSummary();
          break;
        default:
          result = `⚠️ Unknown tool name: ${name}`;
      }

      sessionMessages.push({
        role: "tool",
        content: result,
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

// === Updated Tool Logic ===

function addExpense({
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

  expenseDB.push({
    name,
    amount: parsedAmount,
    category: category || "Uncategorized",
    date: date || new Date().toISOString().slice(0, 10),
    note: note || "",
  });

  return `✅ Expense "${name}" of ₹${parsedAmount} added to "${category}" on ${date}.`;
}

function addIncome({ name, amount }: { name: string; amount: string }) {
  incomeDB.push({ name, amount: parseFloat(amount) });
  return `✅ Income "${name}" of ₹${amount} recorded.`;
}

function getTotalExpense({ from, to }: { from: string; to: string }) {
  const total = expenseDB.reduce((acc, e) => acc + e.amount, 0);
  return `You spent ₹${total} from ${from} to ${to}`;
}

function getMoneyBalance() {
  const totalIncome = incomeDB.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenseDB.reduce((sum, e) => sum + e.amount, 0);
  return `💰 Your balance is ₹${totalIncome - totalExpense}`;
}

function getSmartSummary() {
  if (expenseDB.length === 0 && incomeDB.length === 0) {
    return "No expenses or income yet.";
  }

  const totalIncome = incomeDB.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenseDB.reduce((sum, e) => sum + e.amount, 0);
  const topExpense = [...expenseDB].sort((a, b) => b.amount - a.amount)[0];

  return `📊 Smart Summary:
- Total Income: ₹${totalIncome}
- Total Expense: ₹${totalExpense}
- Highest Expense: ${topExpense?.name} (₹${topExpense?.amount})
- Balance: ₹${totalIncome - totalExpense}`;
}
