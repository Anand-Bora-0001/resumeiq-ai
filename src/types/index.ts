import type { Plan, SubStatus } from "@prisma/client";

export interface UserWithSubscription {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  plan: Plan;
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscription: {
    id: string;
    userId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: SubStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordScore: number;
  interviewReadiness: number;

  matchedKeywords: string[];
  missingKeywords: string[];

  strengths: string[];
  weaknesses: string[];

  suggestions: {
    category: string;
    priority: "high" | "medium" | "low";
    suggestion: string;
    example?: string;
  }[];

  formattingIssues: string[];
  grammarIssues: string[];
  missingSkills: string[];

  atsDetails?: Record<string, unknown>;
  structureAnalysis?: Record<string, unknown>;
  readability?: Record<string, unknown>;
  technicalSkillsMatch?: Record<string, unknown>;
  softSkillsMatch?: Record<string, unknown>;

  resumeRewrite?: {
    rewrittenSummary: string;
    improvedBulletPoints: {
      original: string;
      improved: string;
      reason: string;
    }[];
    suggestedSkillsSection: string;
    overallSuggestions: string[];
  };
  interviewQuestions?: {
    question: string;
    category: string;
    difficulty: string;
    suggestedApproach: string;
  }[];
  coverLetter?: string;
}

export interface ReviewData {
  id: string;
  fileName: string;
  fileUrl: string | null;
  jobTitle: string | null;
  jobDescription: string;
  resumeText: string;
  overallScore: number;
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordScore: number;
  analysisResult: AnalysisResult;
  createdAt: string;
}

export interface DashboardStats {
  totalReviews: number;
  averageScore: number;
  usageToday: number;
  usageLimit: number;
  plan: Plan;
  recentReviews: ReviewData[];
  scoreTrend: { date: string; score: number }[];
}

export interface AdminStats {
  totalUsers: number;
  totalReviews: number;
  totalRevenue: number;
  proUsers: number;
  freeUsers: number;
  recentUsers: {
    id: string;
    email: string;
    plan: Plan;
    createdAt: string;
    reviewCount: number;
  }[];
  revenueByMonth: { month: string; amount: number }[];
}
