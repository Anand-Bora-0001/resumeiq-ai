"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Lock,
  MessageSquare,
  BarChart3,
  BookOpen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDateTime, getScoreColor, getScoreGradient, getScoreLabel } from "@/lib/utils";
import { ScoreBreakdown } from "./score-breakdown";

interface ReviewDetailProps {
  review: {
    id: string;
    fileName: string;
    jobTitle: string | null;
    overallScore: number;
    atsScore: number;
    grammarScore: number;
    formattingScore: number;
    keywordScore: number;
    analysisResult: Record<string, unknown>;
    createdAt: string;
  };
  isPro: boolean;
}

type TabKey = "overview" | "keywords" | "suggestions" | "rewrite" | "interview";

export function ReviewDetail({ review, isPro }: ReviewDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [deleting, setDeleting] = useState(false);
  const analysis = review.analysisResult as Record<string, unknown>;

  const tabs: { key: TabKey | "diagram"; label: string; icon: React.ElementType; proOnly?: boolean }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "keywords", label: "Keywords", icon: Target },
    { key: "diagram", label: "Skill Tree", icon: Sparkles },
    { key: "suggestions", label: "Suggestions", icon: Sparkles },
    { key: "rewrite", label: "AI Rewrite", icon: BookOpen, proOnly: true },
    { key: "interview", label: "Interview Prep", icon: MessageSquare, proOnly: true },
  ];

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        router.push("/dashboard/reviews");
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  const strengths = (analysis.strengths as string[]) || [];
  const weaknesses = (analysis.weaknesses as string[]) || [];
  const suggestions = (analysis.suggestions as { category: string; priority: string; suggestion: string }[]) || [];
  const matchedKeywords = (analysis.matchedKeywords as string[]) || [];
  const missingKeywords = (analysis.missingKeywords as string[]) || [];
  const interviewReadiness = Number(analysis.interviewReadiness) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/reviews"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              {review.fileName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {review.jobTitle && `${review.jobTitle} · `}
              {formatDateTime(review.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Overall", score: review.overallScore },
          { label: "ATS", score: review.atsScore },
          { label: "Keywords", score: review.keywordScore },
          { label: "Formatting", score: review.formattingScore },
          { label: "Grammar", score: review.grammarScore },
          { label: "Interview", score: interviewReadiness },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`mt-1 text-2xl font-bold ${getScoreColor(item.score)}`}>
              {item.score}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(item.score)}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.proOnly && !isPro) {
                toast.error("Upgrade to Pro to access this feature");
                return;
              }
              setActiveTab(tab.key);
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.proOnly && !isPro && <Lock className="h-3 w-3 text-amber-400" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Score Breakdown</h3>
              <ScoreBreakdown
                data={[
                  { name: "ATS", score: review.atsScore },
                  { name: "Keywords", score: review.keywordScore },
                  { name: "Format", score: review.formattingScore },
                  { name: "Grammar", score: review.grammarScore },
                  { name: "Interview", score: interviewReadiness },
                ]}
              />
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                  {strengths.length === 0 && (
                    <p className="text-sm text-muted-foreground">No strengths identified.</p>
                  )}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-red-400" />
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                  {weaknesses.length === 0 && (
                    <p className="text-sm text-muted-foreground">No weaknesses identified.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Matched Keywords ({matchedKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400"
                  >
                    {kw}
                  </span>
                ))}
                {matchedKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No keywords matched.</p>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Missing Keywords ({missingKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-medium text-red-400"
                  >
                    + {kw}
                  </span>
                ))}
                {missingKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No missing keywords found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagram" && (
          <div className="glass-card p-8 overflow-hidden relative">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">AI-Generated Skill Constellation</h3>
            
            {/* Visual Skill Tree Diagram built with CSS */}
            <div className="relative flex flex-col items-center justify-center py-12">
              
              {/* Background Connectors */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-indigo-500/20 rounded-full opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] border border-violet-500/20 rounded-full opacity-50" />
              
              {/* Center Node (Role) */}
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                className="z-10 bg-indigo-600 border-4 border-background w-32 h-32 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50"
              >
                <div className="text-center">
                  <p className="font-bold text-white leading-tight">Full Stack</p>
                  <p className="text-xs text-indigo-200">Engineer</p>
                </div>
              </motion.div>

              {/* Orbiting Nodes */}
              <div className="absolute top-10 left-1/4 -translate-x-1/2 z-10 flex flex-col items-center">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2 border-2 border-background">
                  <span className="font-bold text-white text-xs">Backend</span>
                </motion.div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white backdrop-blur-md border border-white/10">Python, FastAPI</span>
              </div>

              <div className="absolute top-20 right-1/4 translate-x-1/2 z-10 flex flex-col items-center">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2 border-2 border-background">
                  <span className="font-bold text-white text-xs">Frontend</span>
                </motion.div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white backdrop-blur-md border border-white/10">React, TypeScript</span>
              </div>

              <div className="absolute bottom-20 left-1/5 translate-x-1/4 z-10 flex flex-col items-center">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2 border-2 border-background">
                  <span className="font-bold text-white text-[10px]">Cloud</span>
                </motion.div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white backdrop-blur-md border border-white/10">AWS, Docker</span>
              </div>

              <div className="absolute bottom-10 right-1/3 z-10 flex flex-col items-center">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-violet-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 mb-2 border-2 border-background">
                  <span className="font-bold text-white text-xs">AI/ML</span>
                </motion.div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white backdrop-blur-md border border-white/10">Scikit-learn</span>
              </div>
              
              {/* Decorative Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="35%" y2="70%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="65%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

            </div>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Improvement Suggestions
            </h3>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                      s.priority === "high"
                        ? "bg-red-500/10 text-red-400"
                        : s.priority === "medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {s.category}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          s.priority === "high"
                            ? "bg-red-500/10 text-red-400"
                            : s.priority === "medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {s.priority}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{s.suggestion}</p>
                  </div>
                </div>
              ))}
              {suggestions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No suggestions available for this review.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "rewrite" && (
          <div className="glass-card p-6">
            {isPro ? (
              <>
                <h3 className="text-base font-semibold text-foreground mb-4">
                  AI Resume Rewrite
                </h3>
                {analysis.resumeRewrite ? (
                  <div className="space-y-6">
                    {(analysis.resumeRewrite as { rewrittenSummary: string })?.rewrittenSummary && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Improved Summary</h4>
                        <p className="text-sm text-foreground bg-white/[0.02] p-4 rounded-lg border border-white/5">
                          {(analysis.resumeRewrite as { rewrittenSummary: string }).rewrittenSummary}
                        </p>
                      </div>
                    )}
                    {(analysis.resumeRewrite as { improvedBulletPoints: { original: string; improved: string; reason: string }[] })?.improvedBulletPoints?.map((bp: { original: string; improved: string; reason: string }, i: number) => (
                      <div key={i} className="bg-white/[0.02] p-4 rounded-lg border border-white/5">
                        <p className="text-xs font-medium text-red-400 mb-1">Original:</p>
                        <p className="text-sm text-muted-foreground mb-3">{bp.original}</p>
                        <p className="text-xs font-medium text-emerald-400 mb-1">Improved:</p>
                        <p className="text-sm text-foreground mb-2">{bp.improved}</p>
                        <p className="text-xs text-muted-foreground italic">{bp.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    AI rewrite data not available for this review.
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Pro Feature</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Pro to get AI-powered resume rewrites.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-2.5 text-sm font-medium text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "interview" && (
          <div className="glass-card p-6">
            {isPro ? (
              <>
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Interview Preparation
                </h3>
                {analysis.interviewQuestions ? (
                  <div className="space-y-3">
                    {(analysis.interviewQuestions as { question: string; category: string; difficulty: string; suggestedApproach: string }[]).map((q: { question: string; category: string; difficulty: string; suggestedApproach: string }, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-indigo-400 uppercase">{q.category}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            q.difficulty === "hard" ? "bg-red-500/10 text-red-400" :
                            q.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
                            "bg-emerald-500/10 text-emerald-400"
                          }`}>{q.difficulty}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
                        <p className="text-xs text-muted-foreground">{q.suggestedApproach}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Interview preparation data not available for this review.
                  </p>
                )}

                {analysis.coverLetter && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-foreground mb-2">Cover Letter Suggestion</h4>
                    <p className="text-sm text-muted-foreground bg-white/[0.02] p-4 rounded-lg border border-white/5 leading-relaxed">
                      {analysis.coverLetter as string}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Pro Feature</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Pro to get interview preparation and cover letter generation.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-2.5 text-sm font-medium text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
