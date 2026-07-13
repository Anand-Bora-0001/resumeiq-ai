import { z } from "zod";

export const analyzeSchema = z.object({
  resumeText: z
    .string()
    .min(50, "Resume text must be at least 50 characters")
    .max(50000, "Resume text is too long"),
  jobDescription: z
    .string()
    .min(20, "Job description must be at least 20 characters")
    .max(20000, "Job description is too long"),
  jobTitle: z.string().max(200).optional(),
  fileName: z.string().max(255).optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const uploadSchema = z.object({
  file: z.any(),
});

export const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
