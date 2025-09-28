"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Target, BarChart2 } from "lucide-react";
import { CloudLightning } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-24 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-center text-gray-100 font-sans">
      <h1 className="text-6xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
        AI Resume Critiquer
      </h1>
      <p className="max-w-2xl text-xl sm:text-2xl text-gray-300 mb-14 leading-relaxed font-light">
        Experience the future of career growth — effortless, precise, and
        tailored resume feedback, crafted by cutting-edge AI. Elevate your
        chances to land the job you deserve.
      </p>

      <Button
        size="lg"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="mb-20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-transform transform hover:scale-105 duration-300 text-white px-14 py-4 rounded-xl font-semibold"
      >
        Sign in with Google
      </Button>

      <section className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <div className="flex flex-col items-start gap-4 px-6 py-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 hover:shadow-blue-600 transition-shadow duration-300">
          <CloudLightning className="w-12 h-12 text-cyan-400" />
          <h3 className="text-3xl font-semibold text-white">
            Instant, Deep Analysis
          </h3>
          <p className="text-gray-400 font-light text-lg leading-relaxed">
            Get detailed AI-powered insights that dive deep into your
            resume&apos;s structure, language, and impact.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 px-6 py-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 hover:shadow-blue-600 transition-shadow duration-300">
          <Target className="w-12 h-12 text-cyan-400" />
          <h3 className="text-3xl font-semibold text-white">
            Tailored Career Boost
          </h3>
          <p className="text-gray-400 font-light text-lg leading-relaxed">
            Receive expert suggestions tailored to your target roles and
            industries, enhancing relevance and recruiter appeal.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 px-6 py-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 hover:shadow-blue-600 transition-shadow duration-300">
          <BarChart2 className="w-12 h-12 text-cyan-400" />
          <h3 className="text-3xl font-semibold text-white">
            Track & Visualize Progress
          </h3>
          <p className="text-gray-400 font-light text-lg leading-relaxed">
            Upload multiple versions and watch your career story evolve with
            powerful comparison tools.
          </p>
        </div>
      </section>
    </main>
  );
}
