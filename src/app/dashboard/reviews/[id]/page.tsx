import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/subscription";
import { ReviewDetail } from "@/components/analysis/review-detail";

export const metadata: Metadata = {
  title: "Review Details",
};

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;

  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!review) {
    notFound();
  }

  const userIsPro = isPro(user);

  return (
    <ReviewDetail
      review={{
        ...review,
        analysisResult: JSON.parse(review.analysisResult) as Record<string, unknown>,
        createdAt: review.createdAt.toISOString(),
      }}
      isPro={userIsPro}
    />
  );
}
