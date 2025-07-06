// src/components/SmartTip.tsx
"use client";

export default function SmartTip() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">
          📌 Josh’s Smart Tip
        </h3>
        <p className="text-sm text-gray-600">
          You spent 32% more on Transport this month. Consider carpooling or
          switching to public transport. 🚌
        </p>
      </div>

      <div className="mt-4 text-right text-xs text-gray-400">
        Last updated: 2 days ago
      </div>
    </div>
  );
}
