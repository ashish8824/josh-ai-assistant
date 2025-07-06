"use client";

import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "#balance" },
  { name: "Add Expense", href: "#add-expense" },
  { name: "History", href: "#expense-history" },
  { name: "Settings", href: "#", disabled: true },
];

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">Josh 💰</h1>
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium ${
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
