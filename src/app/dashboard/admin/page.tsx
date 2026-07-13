"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, DollarSign, Crown, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface AdminStats {
  totalUsers: number;
  totalReviews: number;
  totalRevenue: number;
  proUsers: number;
  freeUsers: number;
  recentUsers: {
    id: string;
    email: string;
    plan: string;
    createdAt: string;
    reviewCount: number;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Local auth state for demo
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isLocalAuth) {
      fetchStats();
    }
  }, [isLocalAuth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      setIsLocalAuth(true);
      setAuthError("");
    } else {
      setAuthError("Invalid username or password");
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized access");
        router.push("/dashboard");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLocalAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-2 text-sm">Please authenticate to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-md p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-md p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md transition-colors mt-4 flex items-center justify-center"
            >
              Login <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System overview and metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Users</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalUsers}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Reviews</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileText className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalReviews}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pro Subscribers</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <Crown className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.proUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0}% conversion rate
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-white/5">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.plan === "PRO" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
