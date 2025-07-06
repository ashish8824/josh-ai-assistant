"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await resetPassword(email);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded px-4 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded cursor-pointer"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
