import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
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

    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "Price ID required" }, { status: 400 });
    }

    // MOCK MODE: Bypass Stripe and instantly upgrade user
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: "PRO" },
    });

    // Create a dummy subscription record
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      create: {
        userId: user.id,
        stripeSubscriptionId: "mock_sub_" + Date.now(),
        stripePriceId: priceId,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ url: absoluteUrl("/dashboard/billing?success=true") });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
