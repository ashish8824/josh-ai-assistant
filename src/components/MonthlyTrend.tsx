"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function MonthlyIncomeVsExpenseChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const months: string[] = [];
      const incomeTotals: number[] = [];
      const expenseTotals: number[] = [];
      const savings: number[] = [];

      const user = await supabase.auth.getUser();
      const user_id = user.data?.user?.id;

      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { data: incomes } = await supabase
          .from("incomes")
          .select("*")
          .gte("date", startOfMonth.toISOString())
          .lte("date", endOfMonth.toISOString());

        const { data: expenses } = await supabase
          .from("expenses")
          .select("*")
          .gte("date", startOfMonth.toISOString())
          .lte("date", endOfMonth.toISOString());

        const monthLabel = format(startOfMonth, "MMM yyyy");
        const incomeSum =
          incomes?.reduce((acc, item) => acc + item.amount, 0) || 0;
        const expenseSum =
          expenses?.reduce((acc, item) => acc + item.amount, 0) || 0;

        months.push(monthLabel);
        incomeTotals.push(incomeSum);
        expenseTotals.push(expenseSum);
        savings.push(incomeSum - expenseSum);
      }

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeTotals,
            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.2)",
          },
          {
            label: "Expenses",
            data: expenseTotals,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.2)",
          },
          {
            label: "Savings",
            data: savings,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.2)",
          },
        ],
      });
    }

    fetchData();
  }, []);

  if (!chartData) return <p className="text-muted">Loading chart...</p>;

  return (
    <div className="bg-white  p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        📈 Monthly Income vs Expense vs Savings
      </h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: {
              ticks: {
                callback: (value: number) =>
                  `₹${value.toLocaleString("en-IN")}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
