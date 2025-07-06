"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Set New Password
        </h1>
        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded px-4 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded cursor-pointer"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
