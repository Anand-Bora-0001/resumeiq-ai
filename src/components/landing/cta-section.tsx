"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Ready to{" "}
            <span className="gradient-text">Land Your Dream Job?</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have optimized their resumes
            with ResumeIQ AI and landed interviews at top companies.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02]"
            >
              {isSignedIn ? "Go to Dashboard" : "Start Free Today"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              View Pro Features
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required · Free plan available · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
