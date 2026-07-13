"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does ResumeIQ AI analyze my resume?",
    answer:
      "Our AI uses advanced GPT-4.1 technology to analyze your resume against the specific job description you provide. It evaluates ATS compatibility, keyword matching, formatting, grammar, structure, and provides a comprehensive score with detailed improvement suggestions.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "We currently support PDF and DOCX (Microsoft Word) file formats. These are the most commonly used resume formats and the ones most ATS systems accept. We extract the text content and analyze it thoroughly.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "Our ATS scoring algorithm is modeled after real-world ATS systems like Workday, Greenhouse, Lever, and Taleo. While no external tool can guarantee exact ATS results, our analysis covers the key factors that these systems evaluate, giving you a reliable assessment of your resume's compatibility.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 3 resume analyses per day, ATS score calculation, basic formatting feedback, and access to your last 5 review results. It's a great way to get started and see the value before upgrading.",
  },
  {
    question: "What additional features does the Pro plan include?",
    answer:
      "Pro users get unlimited analyses, advanced AI suggestions, detailed keyword matching, AI resume rewrite, cover letter generation, interview question prediction, PDF report export, full review history, and priority AI processing for faster results.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Absolutely! You can cancel your Pro subscription at any time from your billing settings. You'll retain access to Pro features until the end of your current billing period. No hidden fees or cancellation penalties.",
  },
  {
    question: "Is my resume data kept private and secure?",
    answer:
      "Yes, we take data privacy very seriously. Your resume data is encrypted at rest and in transit, stored securely in our database, and is never shared with third parties. You can delete your data at any time from your account settings.",
  },
  {
    question: "Do you store my resume permanently?",
    answer:
      "Your resume text is stored in our database so you can access your review history. You can delete any review at any time. If you delete your account, all your data is permanently removed from our systems.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 gradient-hero opacity-30" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
