import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? "",
            status: "active",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? "",
            status: "active",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PRO",
            stripeCustomerId: session.customer as string,
          },
        });

        // Record payment
        if (session.amount_total) {
          await prisma.payment.create({
            data: {
              userId,
              stripePaymentId: session.payment_intent as string || session.id,
              amount: session.amount_total,
              currency: session.currency || "usd",
              status: "succeeded",
              description: "Pro subscription",
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: "active",
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });

          // Record payment
          if (invoice.amount_paid) {
            await prisma.payment.create({
              data: {
                userId: dbSub.userId,
                stripePaymentId: invoice.payment_intent as string || invoice.id,
                amount: invoice.amount_paid,
                currency: invoice.currency || "usd",
                status: "succeeded",
                description: "Subscription renewal",
              },
            }).catch(() => {
              // Ignore duplicate payment records
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: "canceled" },
          });

          await prisma.user.update({
            where: { id: dbSub.userId },
            data: { plan: "FREE" },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;

        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          const status = subscription.status === "active" ? "active" :
                         subscription.status === "past_due" ? "past_due" :
                         subscription.status === "canceled" ? "canceled" :
                         subscription.status === "unpaid" ? "unpaid" : "active";

          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: status as any,
              stripePriceId: subscription.items.data[0]?.price.id ?? dbSub.stripePriceId,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });

          // Update user plan based on subscription status
          if (subscription.status === "active") {
            await prisma.user.update({
              where: { id: dbSub.userId },
              data: { plan: "PRO" },
            });
          } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
            await prisma.user.update({
              where: { id: dbSub.userId },
              data: { plan: "FREE" },
            });
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
