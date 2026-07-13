import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser || !clerkUser.emailAddresses[0]) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0].emailAddress;
    
    if (!isAdmin(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalReviews = await prisma.review.count();
    const proUsers = await prisma.user.count({ where: { plan: "PRO" } });
    const freeUsers = totalUsers - proUsers;
    
    const payments = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: "succeeded"
      }
    });
    
    const totalRevenue = payments._sum.amount ? payments._sum.amount / 100 : 0;

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: {
          select: { reviews: true }
        }
      }
    });

    const recentUsersMapped = recentUsers.map(u => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt.toISOString(),
      reviewCount: u._count.reviews
    }));

    return NextResponse.json({
      totalUsers,
      totalReviews,
      totalRevenue,
      proUsers,
      freeUsers,
      recentUsers: recentUsersMapped,
      revenueByMonth: [] // Placeholder for actual monthly revenue grouping
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
