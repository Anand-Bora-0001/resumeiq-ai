import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getHistoryLimit } from "@/lib/subscription";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    return NextResponse.json({ reviews, limit, plan: user.plan });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
