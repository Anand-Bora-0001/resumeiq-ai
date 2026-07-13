"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "ResumeIQ AI helped me identify critical keywords I was missing for my Google application. My ATS score went from 45 to 92, and I got the interview within a week!",
    rating: 5,
    avatar: "SC",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Stripe",
    content:
      "The AI suggestions were incredibly specific and actionable. It rewrote my bullet points to be more impactful and results-driven. Landed my dream PM role at Stripe.",
    rating: 5,
    avatar: "MJ",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Meta",
    content:
      "I was applying to 50+ jobs with no callbacks. After using ResumeIQ AI to optimize my resume, I got 8 interview requests in the first two weeks. Absolute game changer.",
    rating: 5,
    avatar: "ER",
    gradient: "from-pink-500 to-rose-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 gradient-hero opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Loved by{" "}
            <span className="gradient-text">Job Seekers Worldwide</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs with
            ResumeIQ AI.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-sm font-bold text-white`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
