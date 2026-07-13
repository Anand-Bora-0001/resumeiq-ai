import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/ai/analyze";
import { analyzeSchema } from "@/lib/validations";
import { checkUsageLimit, incrementUsage, isPro } from "@/lib/subscription";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow up to 60s for AI processing

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const rateLimitResult = rateLimit(`analyze:${clerkId}`, {
      maxRequests: 5,
      windowMs: 60000,
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check usage limit
    const userIsPro = isPro(user);
    const usage = await checkUsageLimit(user.id, user.plan);

    if (!usage.allowed && !userIsPro) {
      return NextResponse.json(
        {
          error: `Daily analysis limit reached (${usage.limit}/day). Upgrade to Pro for unlimited analyses.`,
        },
        { status: 403 }
      );
    }

    // Validate input
    const body = await req.json();
    const validation = analyzeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { resumeText, jobDescription, jobTitle, fileName, fileUrl } =
      validation.data;

    // Run AI analysis
    const analysis = await analyzeResume(resumeText, jobDescription, userIsPro);

    // Store review in database
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        fileName: fileName || "resume",
        fileUrl: fileUrl || null,
        jobTitle: jobTitle || null,
        jobDescription,
        resumeText,
        overallScore: analysis.overallScore,
        atsScore: analysis.atsScore,
        grammarScore: analysis.grammarScore,
        formattingScore: analysis.formattingScore,
        keywordScore: analysis.keywordScore,
        analysisResult: JSON.stringify(analysis),
      },
    });

    // Increment usage
    await incrementUsage(user.id);

    return NextResponse.json({
      reviewId: review.id,
      overallScore: analysis.overallScore,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
