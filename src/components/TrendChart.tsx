"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { supabase } from "@/lib/supabaseClient";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function TrendsChart() {
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await supabase.auth.getUser();
      const user_id = user.data?.user?.id;
      console.log("user-id", user_id);

      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("amount, date");

      if (error) {
        console.error("Error fetching expenses:", error);
        return;
      }

      const totals = new Array(12).fill(0);
      expenses.forEach((expense: any) => {
        const month = new Date(expense.date).getMonth(); // 0 = Jan
        totals[month] += expense.amount;
      });

      setMonthlyTotals(totals);
    };

    fetchData();
  }, []);

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyTotals,
        fill: true,
        borderColor: "#3B82F6", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        pointBackgroundColor: "#3B82F6",
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md w-full h-96">
      <h2 className="text-xl font-semibold mb-4">Spending Trends</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
