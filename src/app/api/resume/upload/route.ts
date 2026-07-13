import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { parsePdf } from "@/lib/parsers/pdf-parser";
import { parseDocx } from "@/lib/parsers/docx-parser";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const rateLimitResult = rateLimit(`upload:${userId}`, {
      maxRequests: 20,
      windowMs: 60000,
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are supported." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 10MB." },
        { status: 400 }
      );
    }

    // Parse file
    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText: string;

    if (file.type === "application/pdf") {
      resumeText = await parsePdf(buffer);
    } else {
      resumeText = await parseDocx(buffer);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the file. Please ensure it contains readable text (not scanned images).",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      resumeText: resumeText.trim(),
      fileName: file.name,
      fileUrl: "",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file. Please try again." },
      { status: 500 }
    );
  }
}
