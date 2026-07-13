"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  Target,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "ATS Compatibility Score",
    description:
      "Get a detailed ATS compatibility score that tells you exactly how well your resume will perform in automated screening systems used by 99% of Fortune 500 companies.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Keyword Matching",
    description:
      "Our AI identifies missing keywords, technical skills, and industry terms from the job description that should appear in your resume to maximize your match rate.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: BarChart3,
    title: "Detailed Score Breakdown",
    description:
      "View comprehensive charts showing your scores across ATS compatibility, keyword match, formatting, grammar, and interview readiness — all in one dashboard.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description:
      "Receive specific, actionable suggestions to improve each section of your resume. Our AI rewrites weak bullet points into powerful, results-driven statements.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "Grammar & Formatting",
    description:
      "Catch grammar errors, inconsistent formatting, and structural issues that could hurt your chances. Get recommendations for the optimal resume layout.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Interview Readiness",
    description:
      "Get predicted interview questions based on your resume and the job description, with suggested approaches to answer them confidently and effectively.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
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
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Everything You Need to{" "}
            <span className="gradient-text">Perfect Your Resume</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes your resume from every angle, giving you the
            insights and suggestions you need to stand out from the competition.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative glass-card p-6 transition-all duration-300 hover:bg-white/[0.06] glow-hover"
            >
              {/* Icon */}
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient border effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-border pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
