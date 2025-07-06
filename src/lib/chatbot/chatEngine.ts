import Groq from "groq-sdk";
import { toolDefinitions } from "./toolDefinitions";
import { toolHandlers } from "./toolHandlers";
import { getSystemPrompt } from "./systemPrompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function runChatSession(messages: any[]) {
  const now = new Date().toUTCString();

  const sessionMessages = [
    { role: "system", content: getSystemPrompt(now) },
    ...messages,
  ];

  const initial = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: sessionMessages,
    tools: toolDefinitions,
  });

  const msg = initial.choices[0].message;
  sessionMessages.push(msg);

  const toolCalls = msg.tool_calls || [];

  for (const tool of toolCalls) {
    try {
      const args = JSON.parse(tool.function.arguments || "{}");
      const result = await toolHandlers[tool.function.name](args);

      sessionMessages.push({
        role: "tool",
        content: result,
        tool_call_id: tool.id,
      });
    } catch (err: any) {
      sessionMessages.push({
        role: "tool",
        content: `⚠️ Error in "${tool.function.name}": ${err.message}`,
        tool_call_id: tool.id,
      });
    }
  }

  const final = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: sessionMessages,
  });

  return final.choices[0].message.content;
}
