"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CreditCard,
  Sparkles,
  Check,
  Crown,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getPlanFeatures } from "@/lib/subscription";

import { Suspense } from "react";

function BillingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null>(null);
  const [fetchingPlan, setFetchingPlan] = useState(true);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Successfully subscribed to Pro! 🎉");
    }
    if (searchParams.get("canceled") === "true") {
      toast.info("Checkout was canceled.");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/billing/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setFetchingPlan(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_default",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch {
      toast.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const isPro = subscription?.plan === "PRO";
  const freeFeatures = getPlanFeatures("FREE");
  const proFeatures = getPlanFeatures("PRO");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Current Plan
        </h2>

        {fetchingPlan ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading plan details...
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isPro
                    ? "bg-gradient-to-br from-amber-500 to-orange-500"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {isPro ? (
                  <Crown className="h-6 w-6 text-white" />
                ) : (
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPro ? "$9/month" : "Free forever"}
                </p>
              </div>
            </div>

            {isPro ? (
              <div className="flex items-center gap-3">
                {subscription?.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Cancels at period end
                  </div>
                )}
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-all"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage Billing
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Simulate Pro Upgrade (Free)
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free */}
        <div className={`glass-card p-6 ${!isPro ? "border-indigo-500/20" : ""}`}>
          <h3 className="text-lg font-semibold text-foreground mb-1">Free</h3>
          <p className="text-2xl font-bold gradient-text mb-4">$0<span className="text-sm text-muted-foreground font-normal">/forever</span></p>
          <ul className="space-y-2">
            {freeFeatures.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className={`glass-card p-6 ${isPro ? "border-indigo-500/20 glow" : ""}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground mb-1">Pro</h3>
            {isPro && (
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </div>
          <p className="text-2xl font-bold gradient-text mb-4">$9<span className="text-sm text-muted-foreground font-normal">/month</span></p>
          <ul className="space-y-2">
            {proFeatures.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>}>
      <BillingContent />
    </Suspense>
  );
}
