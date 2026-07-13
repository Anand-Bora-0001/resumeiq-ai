"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Target, Zap } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn: clerkIsSignedIn } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("logout=true")) {
      setIsLoggedOut(true);
    }
  }, []);

  const isSignedIn = clerkIsSignedIn && !isLoggedOut;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient-bg">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-violet-500/8 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/6 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3 w-3" />
              AI-Powered Resume Analysis
              <Sparkles className="h-3 w-3" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Land Better Jobs with
            <br />
            <span className="gradient-text">AI-Powered Resume</span>
            <br />
            Reviews
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume, paste a job description, and get instant
            AI-powered feedback on ATS compatibility, missing keywords,
            formatting, and actionable improvement suggestions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02]"
            >
              {isSignedIn ? "Go to Dashboard" : "Start Free"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-white/10 hover:border-white/20"
            >
              Get Pro — $9/mo
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "50K+", label: "Resumes Analyzed" },
              { value: "85%", label: "Interview Rate" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: FileText, label: "ATS Score Analysis" },
              { icon: Target, label: "Keyword Matching" },
              { icon: Zap, label: "AI Suggestions" },
            ].map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground"
              >
                <pill.icon className="h-3.5 w-3.5 text-indigo-400" />
                {pill.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
