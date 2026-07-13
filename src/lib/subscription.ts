import { prisma } from "@/lib/prisma";
import { MAX_FREE_REVIEWS_PER_DAY, MAX_FREE_HISTORY } from "@/lib/utils";
import type { Plan, User, Subscription } from "@prisma/client";

type UserWithSubscription = User & {
  subscription: Subscription | null;
};

export function isPro(user: UserWithSubscription): boolean {
  if (user.plan === "PRO") return true;
  if (
    user.subscription &&
    user.subscription.status === "ACTIVE" &&
    new Date(user.subscription.currentPeriodEnd) > new Date()
  ) {
    return true;
  }
  return false;
}

export async function checkUsageLimit(userId: string, plan: Plan): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  if (plan === "PRO") {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await prisma.usageRecord.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  const used = usage?.count ?? 0;

  return {
    allowed: used < MAX_FREE_REVIEWS_PER_DAY,
    used,
    limit: MAX_FREE_REVIEWS_PER_DAY,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.usageRecord.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      userId,
      date: today,
      count: 1,
    },
  });
}

export function canAccessFeature(
  plan: Plan,
  feature: "pdf_export" | "history" | "advanced_ai" | "priority"
): boolean {
  if (plan === "PRO") return true;

  const freeFeatures: Record<string, boolean> = {
    pdf_export: false,
    history: false,
    advanced_ai: false,
    priority: false,
  };

  return freeFeatures[feature] ?? false;
}

export function getHistoryLimit(plan: Plan): number {
  return plan === "PRO" ? 1000 : MAX_FREE_HISTORY;
}

export function getPlanFeatures(plan: "FREE" | "PRO") {
  if (plan === "FREE") {
    return {
      name: "Free",
      price: 0,
      features: [
        "3 resume reviews/day",
        "ATS Score",
        "Basic Suggestions",
        "Last 5 reviews history",
      ],
      limitations: [
        "No PDF Export",
        "No Advanced AI Suggestions",
        "No Keyword Matching",
        "No Resume Rewrite",
      ],
    };
  }

  return {
    name: "Pro",
    price: 9,
    features: [
      "Unlimited Reviews",
      "Advanced AI Suggestions",
      "Keyword Matching",
      "Resume History",
      "Export PDF",
      "Priority AI Processing",
      "AI Resume Rewrite",
      "Cover Letter Generator",
      "Interview Questions",
    ],
    limitations: [],
  };
}
