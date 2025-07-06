"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
  }, []);

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-text">
        Welcome back, Josh User 👋
      </h1>
      <p className="text-sm text-gray-500">{today}</p>
    </header>
  );
}
