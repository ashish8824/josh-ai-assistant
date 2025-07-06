"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function LandingPage() {
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={0}
    >
      <motion.div variants={fadeIn} custom={1} className="max-w-3xl">
        <h1 className="text-5xl font-bold text-indigo-700 mb-4">
          Meet <span className="text-indigo-900">Josh</span> 🧠
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your AI-powered finance assistant.
          <br />
          Track expenses, plan savings, set budgets — all in one smart
          dashboard.
        </p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeIn}
          custom={2}
        >
          <Link
            href="/signin"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center gap-2 shadow-lg transition"
          >
            Start Managing My Money <ArrowRight size={18} />
          </Link>

          <Link
            href="#features"
            className="text-indigo-600 hover:underline text-lg"
          >
            Learn more
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        id="features"
        className="mt-20 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-8"
          variants={fadeIn}
          custom={3}
        >
          Features
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              custom={index + 4}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="mt-24 w-full max-w-4xl text-left"
        variants={fadeIn}
        custom={13}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          What users say
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
          <blockquote className="p-4 bg-white border rounded-xl shadow">
            “Josh helped me stick to my food budget for the first time ever.
            Love the savings tips!”
            <footer className="mt-2 text-sm text-gray-500">
              — Riya, Bangalore
            </footer>
          </blockquote>
          <blockquote className="p-4 bg-white border rounded-xl shadow">
            “The AI summaries are 🔥. I know my top expenses and can plan better
            now.”
            <footer className="mt-2 text-sm text-gray-500">
              — Ankit, Pune
            </footer>
          </blockquote>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="mt-20 text-sm text-gray-500"
        variants={fadeIn}
        custom={15}
      >
        Built with ❤️ by Ashish • © {new Date().getFullYear()}
      </motion.footer>
    </motion.main>
  );
}

const features = [
  {
    title: "📊 Smart Expense Tracking",
    description:
      "Categorize and track expenses automatically across Food, Transport, Rent, and more.",
  },
  {
    title: "💼 Real-Time Balance & Income Logs",
    description:
      "Track your income and know your exact balance anytime — ₹ updated in real-time.",
  },
  {
    title: "📅 Monthly Budgeting",
    description:
      "Set budgets by category and track how much you've spent vs planned.",
  },
  {
    title: "🚨 Spike & Recurring Detection",
    description:
      "Josh detects unusual spending or repeating expenses like EMIs and subscriptions.",
  },
  {
    title: "📈 Smart Summaries & Comparisons",
    description:
      "Get monthly financial insights and see how this month compares to last.",
  },
  {
    title: "💡 Daily Spending Limit",
    description: "Josh recommends safe daily limits to stay within budget.",
  },
  {
    title: "📥 AI-Powered Suggestions",
    description:
      "Josh suggests how much to invest, save, or adjust budgets based on your habits.",
  },
  {
    title: "🔐 Private & Secure",
    description:
      "All your data is encrypted and stored securely using Supabase.",
  },
];
