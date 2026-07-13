"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with resume optimization.",
    features: [
      { text: "3 resume reviews/day", included: true },
      { text: "ATS Score Analysis", included: true },
      { text: "Basic Suggestions", included: true },
      { text: "Last 5 reviews history", included: true },
      { text: "Advanced AI Suggestions", included: false },
      { text: "Keyword Matching", included: false },
      { text: "Resume Rewrite", included: false },
      { text: "Export PDF Reports", included: false },
      { text: "Interview Questions", included: false },
      { text: "Cover Letter Generator", included: false },
    ],
    cta: "Start Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Unlimited access to all AI-powered features.",
    features: [
      { text: "Unlimited Reviews", included: true },
      { text: "ATS Score Analysis", included: true },
      { text: "Advanced AI Suggestions", included: true },
      { text: "Full Resume History", included: true },
      { text: "Keyword Matching", included: true },
      { text: "AI Resume Rewrite", included: true },
      { text: "Export PDF Reports", included: true },
      { text: "Interview Questions", included: true },
      { text: "Cover Letter Generator", included: true },
      { text: "Priority AI Processing", included: true },
    ],
    cta: "Get Pro",
    href: "/sign-up",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Simple,{" "}
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you need unlimited access. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative glass-card p-8 flex flex-col ${
                plan.highlighted
                  ? "border-indigo-500/30 bg-indigo-500/5 glow"
                  : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25">
                    <Crown className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold gradient-text">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-3 text-sm"
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-foreground"
                          : "text-zinc-600"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "gradient-primary text-white hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25"
                    : "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                {plan.cta}
                {plan.highlighted && <Sparkles className="h-3.5 w-3.5" />}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
