import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { PDFService } from "@/lib/pdf-service";

// Increase timeout for PDF processing
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  console.log("Upload API called");

  try {
    // 1. Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Form Data
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const jobRole = formData.get("jobRole") as string;

    console.log("Form data parsed - File:", file?.name, "Job Role:", jobRole);

    // 3. File Validation
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 4MB" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (!jobRole || jobRole.trim().length === 0) {
      return NextResponse.json(
        { error: "Job role is required" },
        { status: 400 }
      );
    }

    // 4. Upload to Vercel Blob Storage
    console.log("Uploading to blob storage...");
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });
    console.log("Blob upload successful:", blob.url);

    // 5. Parse PDF Text
    console.log("Starting PDF text extraction...");
    let extractedText: string;
    let textLength = 0;

    try {
      extractedText = await PDFService.extractTextFromFile(file);
      textLength = extractedText.length;
      console.log("PDF extraction successful. Text length:", textLength);

      if (textLength < 50) {
        console.warn("PDF may be image-based. Text length:", textLength);
        throw new Error("PDF may be image-based or contain very little text");
      }
    } catch (parseError) {
      console.error("PDF parsing failed:", parseError);

      extractedText = `TEXT_EXTRACTION_FAILED: ${
        parseError instanceof Error ? parseError.message : "Unknown error"
      }`;

      const resumeRecord = await prisma.resume.create({
        data: {
          userId: session.user.id,
          fileName: file.name,
          fileUrl: blob.url,
          rawText: extractedText,
          jobRole: jobRole.trim(),
        },
      });

      return NextResponse.json({
        success: false,
        resumeId: resumeRecord.id,
        error: `PDF processing failed: ${
          parseError instanceof Error
            ? parseError.message
            : "Please try a different PDF file"
        }`,
        textLength: 0,
      });
    }

    // 6. VERSIONING LOGIC: Check if this is an update to an existing resume
    console.log("Checking for previous versions...");
    const previousResumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
        fileName: file.name, // Same filename suggests an update
        isCurrent: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let parentId: string | undefined;
    let versionNumber = 1;

    if (previousResumes.length > 0) {
      const previousResume = previousResumes[0];
      parentId = previousResume.id;
      versionNumber = previousResume.versionNumber + 1;

      // Mark previous version as not current
      await prisma.resume.update({
        where: { id: previousResume.id },
        data: { isCurrent: false },
      });
      console.log(
        `Marked previous version ${previousResume.versionNumber} as not current`
      );
    }

    // 7. Save new resume with versioning info
    console.log("Saving to database with version:", versionNumber);
    const resumeRecord = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: blob.url,
        rawText: extractedText,
        jobRole: jobRole.trim(),
        parentId: parentId,
        versionNumber: versionNumber,
        isCurrent: true,
      },
    });
    console.log("Database save successful. Resume ID:", resumeRecord.id);

    // 8. Trigger background analysis
    if (extractedText.length >= 50) {
      console.log("Starting background analysis...");

      // Use the AI service directly (no API call needed)
      (async () => {
        try {
          const { AIService } = await import("@/lib/ai-service");
          const { prisma } = await import("@/lib/db");
          const { toPrismaAnalysis } = await import("@/types/resume");

          const analysis = await AIService.analyzeResume(
            extractedText,
            jobRole.trim()
          );

          // Convert to Prisma-compatible format
          const prismaAnalysis = toPrismaAnalysis(analysis);

          await prisma.resume.update({
            where: { id: resumeRecord.id },
            data: { feedback: prismaAnalysis },
          });

          console.log("✅ Background analysis completed for:", resumeRecord.id);
        } catch (error) {
          console.error("❌ Background analysis failed:", error);
        }
      })();
    }

    // 9. Return Success Response with version info
    return NextResponse.json({
      success: true,
      resumeId: resumeRecord.id,
      fileName: file.name,
      textLength,
      versionNumber,
      isNewVersion: !!parentId,
      previousVersionId: parentId,
      preview:
        extractedText.substring(0, 200) +
        (extractedText.length > 200 ? "..." : ""),
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload. Please try again." },
      { status: 500 }
    );
  }
}
