"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Sign-up successful! Check your email to confirm.");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
          <UserPlus size={28} /> Sign Up
        </h2>

        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3.5 text-gray-500 hover:text-indigo-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition duration-300 cursor-pointer flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          Create Account
        </button>

        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Sign in
          </a>
        </p>

        <p className="mt-2 text-sm text-center">
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
}
