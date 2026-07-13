# ResumeIQ AI — 5-Minute Demo Script

## [0:00 - 0:30] Introduction & Landing Page
**Visual:** Scroll through the landing page.
**Script:** "Welcome to ResumeIQ AI. This is a complete SaaS platform designed to help job seekers land more interviews by optimizing their resumes against specific job descriptions using GPT-4.1. The landing page features a beautiful, responsive dark-mode UI with glassmorphism, animated gradients, and clear feature breakdowns."

## [0:30 - 1:00] Authentication & Dashboard
**Visual:** Click 'Start Free', log in via Clerk, and arrive at the Dashboard.
**Script:** "Authentication is handled seamlessly by Clerk. Once logged in, users land on their dashboard. Here they can see their total reviews, average ATS score, today's usage limit, and their score trend chart built with Recharts. It's a clean overview of their progress."

## [1:00 - 2:30] Core Feature: AI Analysis
**Visual:** Go to 'Analyze Resume'. Upload a PDF, paste a job description, and click Analyze. Wait for the loading state to finish.
**Script:** "Let's run an analysis. I'll upload a sample PDF resume and paste a Software Engineer job description. Our API extracts the text using `pdf-parse`, then sends it to our custom AI orchestrator. We run 5 highly optimized GPT-4.1 prompts in parallel to score the resume on ATS compatibility, keywords, formatting, and grammar."

## [2:30 - 3:30] Review Results & Details
**Visual:** Explore the Review Details page. Click through the Overview, Keywords, Suggestions, and Pro tabs.
**Script:** "The results page is highly detailed. We have a radar chart for score breakdown. The 'Keywords' tab shows exactly what technical skills are missing. The 'Suggestions' tab provides actionable, prioritized feedback. And if we look at the 'AI Rewrite' and 'Interview Prep' tabs, you'll see these are locked behind our Pro plan."

## [3:30 - 4:15] Subscription & Stripe Billing
**Visual:** Go to Billing page, click 'Upgrade to Pro'. Show the Stripe checkout page. Return to the billing portal.
**Script:** "Monetization is built right in using Stripe. Free users are limited to 3 reviews a day. When they hit a wall or want advanced features, they can upgrade. Clicking 'Upgrade' creates a secure Stripe Checkout session. Once paid, Stripe webhooks automatically update our Prisma database, granting instant access to unlimited reviews and AI rewrites."

## [4:15 - 4:45] Admin Dashboard
**Visual:** Log in with an admin email, navigate to the Admin Dashboard.
**Script:** "For the platform owner, there's a protected Admin Dashboard. It tracks total users, revenue, pro conversion rates, and recent signups. This provides critical business metrics without needing to check the Stripe or Supabase dashboards constantly."

## [4:45 - 5:00] Conclusion & Tech Stack
**Visual:** Back to the main dashboard, switch to Light Mode using the theme toggle.
**Script:** "The entire platform is built on Next.js 15 App Router, styled with Tailwind and shadcn/ui, and uses Supabase PostgreSQL for the database. It is a production-ready, fully-featured SaaS built to scale. Thank you for watching!"
