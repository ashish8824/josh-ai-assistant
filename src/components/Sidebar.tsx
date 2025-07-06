"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiTrendingUp,
  FiSettings,
  FiBarChart2,
  FiList,
  FiPlus,
  FiClock,
} from "react-icons/fi";

const navItems = [
  {
    title: "Main",
    links: [
      { name: "Dashboard", href: "#balance", icon: <FiBarChart2 /> },
      { name: "Add Expense", href: "#add-expense", icon: <FiPlus /> },
      { name: "Expense List", href: "#expense-list", icon: <FiList /> },
      { name: "History", href: "#expense-history", icon: <FiClock /> },
    ],
  },
  {
    title: "Reports",
    links: [
      { name: "Trends", href: "#trends", icon: <FiTrendingUp /> },
      { name: "Settings", href: "#settings", icon: <FiSettings /> },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <aside
        className={`md:sticky md:top-0 h-screen w-64 bg-primary text-white p-6 z-40 
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:static flex flex-col justify-between overflow-y-auto`}
      >
        {/* Profile */}
        <div>
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-primary flex items-center justify-center text-2xl font-bold">
              J
            </div>
            <h2 className="mt-2 font-semibold text-lg">John Doe</h2>
            <p className="text-sm text-white/70">Finance Manager</p>
          </div>

          {/* Navigation */}
          {navItems.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-sm uppercase text-white/60 mb-2 px-2">
                {section.title}
              </p>
              <nav className="space-y-1">
                {section.links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded transition-all text-slate-500 hover:bg-white hover:text-primary hover:translate-x-1"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-white/30 pt-4">
          <button className="flex items-center gap-2 text-white/80 hover:text-white">
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
