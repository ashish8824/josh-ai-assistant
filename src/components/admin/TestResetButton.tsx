"use client";
import { useState } from "react";

export function TestResetButton() {
  const [status, setStatus] = useState("");

  async function handleReset() {
    setStatus("Resetting...");
    const res = await fetch("/api/admin/reset-db", {
      method: "POST",
    });

    const data = await res.json();
    if (res.ok) {
      setStatus(data.message);
    } else {
      setStatus(data.error || "Something went wrong.");
    }
  }

  return (
    <div className="p-4 border rounded bg-gray-100 w-fit">
      <button
        onClick={handleReset}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset Database with Test Data
      </button>
      <p className="mt-2 text-sm text-gray-700">{status}</p>
    </div>
  );
}
