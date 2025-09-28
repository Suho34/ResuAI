import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AIService } from "@/lib/ai-service";
import { NextRequest, NextResponse } from "next/server";
import { toPrismaAnalysis } from "@/types/resume";

// GET: Fetch existing analysis results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await params;

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis: resume.feedback,
      hasAnalysis: !!resume.feedback,
      status: resume.feedback ? "completed" : "pending",
    });
  } catch (error) {
    console.error("GET analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis results" },
      { status: 500 }
    );
  }
}

// POST: Trigger new analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await params;

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!resume.rawText || resume.rawText.length < 50) {
      return NextResponse.json(
        { error: "Resume text too short for analysis" },
        { status: 400 }
      );
    }

    const analysis = await AIService.analyzeResume(
      resume.rawText,
      resume.jobRole || "Software Developer"
    );

    // Convert to Prisma-compatible format
    const prismaAnalysis = toPrismaAnalysis(analysis);

    await prisma.resume.update({
      where: { id: resumeId },
      data: { feedback: prismaAnalysis },
    });

    return NextResponse.json({
      success: true,
      hasAnalysis: true,
      analysis: analysis,
      status: "completed",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
