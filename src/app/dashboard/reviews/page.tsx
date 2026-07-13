import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getHistoryLimit } from "@/lib/subscription";
import { formatDate, getScoreColor } from "@/lib/utils";
import { FileText, Upload, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Review History",
};

export default async function ReviewsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const limit = getHistoryLimit(user.plan);

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      fileName: true,
      jobTitle: true,
      overallScore: true,
      atsScore: true,
      keywordScore: true,
      createdAt: true,
    },
  });

  const totalCount = await prisma.review.count({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review History</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount} total review{totalCount !== 1 ? "s" : ""}
            {user.plan === "FREE" && totalCount > limit && (
              <span className="text-amber-400">
                {" "}
                · Showing last {limit} (upgrade for full history)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          <Upload className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/dashboard/reviews/${review.id}`}
              className="flex items-center justify-between p-4 glass-card hover:bg-white/[0.06] transition-all group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 shrink-0">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-indigo-400 transition-colors">
                    {review.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.jobTitle && `${review.jobTitle} · `}
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">ATS</p>
                    <p className={`text-sm font-bold ${getScoreColor(review.atsScore)}`}>
                      {review.atsScore}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Keywords</p>
                    <p className={`text-sm font-bold ${getScoreColor(review.keywordScore)}`}>
                      {review.keywordScore}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Overall</p>
                  <p className={`text-xl font-bold ${getScoreColor(review.overallScore)}`}>
                    {review.overallScore}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Upload your first resume and get AI-powered feedback to start improving.
          </p>
          <Link
            href="/dashboard/analyze"
            className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-2.5 text-sm font-medium text-white"
          >
            <Upload className="h-4 w-4" />
            Analyze Now
          </Link>
        </div>
      )}

      {user.plan === "FREE" && totalCount > limit && (
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-amber-400" />
            <p className="text-sm text-muted-foreground">
              {totalCount - limit} older reviews hidden. Upgrade to see full history.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Upgrade →
          </Link>
        </div>
      )}
    </div>
  );
}
