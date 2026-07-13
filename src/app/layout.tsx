import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ResumeIQ AI — Land Better Jobs with AI-Powered Resume Reviews",
    template: "%s | ResumeIQ AI",
  },
  description:
    "AI-powered resume analysis platform. Get ATS compatibility scores, keyword matching, formatting feedback, and tailored improvement suggestions to land your dream job.",
  keywords: [
    "resume review",
    "ATS score",
    "resume analyzer",
    "AI resume",
    "job application",
    "career",
    "resume optimization",
  ],
  authors: [{ name: "ResumeIQ AI" }],
  openGraph: {
    title: "ResumeIQ AI — Land Better Jobs with AI-Powered Resume Reviews",
    description:
      "AI-powered resume analysis platform. Get ATS scores, keyword matching, and tailored suggestions.",
    type: "website",
    locale: "en_US",
    siteName: "ResumeIQ AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeIQ AI — AI-Powered Resume Reviews",
    description:
      "Upload your resume, paste a job description, and get instant AI-powered feedback.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(17, 17, 24, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f5f5f7",
                  backdropFilter: "blur(20px)",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
