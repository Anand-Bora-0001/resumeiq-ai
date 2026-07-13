# ResumeIQ AI

![ResumeIQ Hero Banner](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-purple)

**Land Better Jobs with AI-Powered Resume Reviews.**  
ResumeIQ AI is a complete SaaS platform built to help job seekers optimize their resumes against specific job descriptions using OpenAI's advanced GPT models.

## 🌟 Features

- **Full Marketing Site**: Beautiful dark-mode UI with glassmorphism, responsive navigation, and animated components powered by Framer Motion.
- **AI-Powered Analysis**: Upload PDFs or DOCX files and get instant feedback on ATS compatibility, missing keywords, and formatting.
- **Detailed Scoring**: Visual radar charts (Recharts) detailing strengths, weaknesses, and actionable suggestions.
- **Subscription Billing**: Fully integrated with Stripe (simulated in local mode) to handle Pro upgrades and quota management.
- **Admin Dashboard**: Real-time stats showing total users, revenue, and active reviews.
- **Authentication**: Seamless Clerk integration with Next.js middleware protection.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Database**: Prisma ORM (SQLite for local testing, PostgreSQL for Production)
- **Authentication**: Clerk (Mocked in Local Mode)
- **AI Engine**: OpenAI API (`gpt-4-turbo` / `gpt-5.4-mini`)
- **Payments**: Stripe Checkout & Webhooks

## 🚀 Running Locally (Local Offline Mode)

The project is currently configured to run in **100% Local Mode**, meaning it uses a local SQLite database and bypasses Clerk authentication to allow for instant testing without API keys (except OpenAI).

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your OpenAI API Key:
```bash
OPENAI_API_KEY="sk-..."
```
*(All other keys for Clerk, Supabase, and Stripe are bypassed in this mode).*

### 2. Initialize the Database
Generate the Prisma client and push the SQLite schema:
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed the Mock User
Run the seed script to create your mock user session:
```bash
node scripts/seed.js
```

### 4. Start the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000`. You will be automatically authenticated as "Mock User" and can access the dashboard to test the AI features.

## 🌍 Deploying to Production

To take this SaaS to production, you will need to revert the local mocks:
1. Revert `tsconfig.json` to remove the `@clerk/nextjs` mock aliases.
2. Update `prisma/schema.prisma` to use `postgresql` instead of `sqlite`.
3. Provide real API keys for Clerk, Supabase, and Stripe in your production environment variables.
4. Deploy seamlessly to Vercel using the provided `vercel.json` config.

---
*Built with ❤️ for the ultimate developer experience.*
