// src/components/Chatbot/ChatToggle.tsx

"use client";

import { MessageSquare } from "lucide-react";

export default function ChatToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
    >
      <MessageSquare size={24} />
    </button>
  );
}
