"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

const expenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .min(1, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  note: z.string().max(100, "Note should be short").optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const categories = ["Grocery", "Transport", "Bills", "Food", "Others"];

// Set date once at module load (same on server + client)
const today = new Date().toISOString().slice(0, 10);

export default function AddExpenseForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: "",
      date: today, // ✅ static value to match SSR and CSR
      note: "",
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Manual Entry", // or add a field to capture from user
        ...data,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("✅ Expense saved:", result);
      reset();
    } else {
      console.error("❌ Error saving expense:", result.error);
      alert("Failed to save expense. Try again.");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        🧾 Add a New Expense
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Amount (₹)</label>
          <input
            type="number"
            step="1"
            {...register("amount", { valueAsNumber: true })}
            placeholder="e.g. 500"
            className="rounded-lg border-gray-300 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {errors.amount && (
            <p className="text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Category</label>
          <select
            {...register("category")}
            className="rounded-lg border-gray-300 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            {...register("date")}
            className="rounded-lg border-gray-300 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Note */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-sm text-gray-600">Note</label>
          <textarea
            rows={3}
            {...register("note")}
            placeholder="e.g. Grocery for the week"
            className="rounded-lg border-gray-300 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
          {errors.note && (
            <p className="text-sm text-red-600">{errors.note.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}
