import { Metadata } from "next";
import Link from "next/link";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkUsageLimit, isPro } from "@/lib/subscription";
import { redirect } from "next/navigation";
import {
  FileText,
  TrendingUp,
  Upload,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import { ScoreTrend } from "@/components/dashboard/score-trend";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const userIsPro = isPro(user);
  const usage = await checkUsageLimit(user.id, user.plan);

  // Get recent reviews
  const recentReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get total reviews count
  const totalReviews = await prisma.review.count({
    where: { userId: user.id },
  });

  // Calculate average score
  const avgScore =
    recentReviews.length > 0
      ? Math.round(
          recentReviews.reduce((sum, r) => sum + r.overallScore, 0) /
            recentReviews.length
        )
      : 0;

  // Get score trend (last 10 reviews)
  const trendReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 10,
    select: { overallScore: true, createdAt: true },
  });

  const scoreTrend = trendReviews.map((r) => ({
    date: formatDate(r.createdAt),
    score: r.overallScore,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.firstName || "there"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your resume analysis activity.
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          <Upload className="h-4 w-4" />
          Analyze Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Reviews</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <FileText className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalReviews}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Score</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
          </div>
          <p className={`mt-2 text-3xl font-bold ${getScoreColor(avgScore)}`}>
            {avgScore || "—"}
          </p>
          {avgScore > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(avgScore)}</p>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Usage Today</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {usage.used}
            <span className="text-base text-muted-foreground font-normal">
              /{userIsPro ? "∞" : usage.limit}
            </span>
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Plan</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <CreditCard className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">{user.plan}</span>
            {userIsPro && <Sparkles className="h-5 w-5 text-amber-400" />}
          </div>
          {!userIsPro && (
            <Link
              href="/dashboard/billing"
              className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block"
            >
              Upgrade to Pro →
            </Link>
          )}
        </div>
      </div>

      {/* Charts & Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            ATS Score Trend
          </h2>
          {scoreTrend.length > 1 ? (
            <ScoreTrend data={scoreTrend} />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Complete at least 2 reviews to see your score trend.
              </p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Reviews
            </h2>
            {recentReviews.length > 0 && (
              <Link
                href="/dashboard/reviews"
                className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/dashboard/reviews/${review.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 shrink-0">
                      <FileText className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {review.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-lg font-bold ${getScoreColor(
                        review.overallScore
                      )}`}
                    >
                      {review.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No reviews yet. Upload your first resume to get started!
              </p>
              <Link
                href="/dashboard/analyze"
                className="mt-3 inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-xs font-medium text-white"
              >
                <Upload className="h-3 w-3" />
                Analyze Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
