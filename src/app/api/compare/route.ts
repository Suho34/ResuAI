import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ComparisonEngine } from "@/lib/comparison-engine";
import { safeValidateAnalysis } from "@/lib/validation";
import { CompareResponse } from "@/types/comparison";

export async function POST(
  request: NextRequest
): Promise<NextResponse<CompareResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { resumeId1, resumeId2 } = await request.json();

    if (!resumeId1 || !resumeId2) {
      return NextResponse.json(
        {
          success: false,
          error: "Both resume IDs are required",
        },
        { status: 400 }
      );
    }

    // Verify user owns both resumes
    const [resume1, resume2] = await Promise.all([
      prisma.resume.findFirst({
        where: { id: resumeId1, userId: session.user.id },
      }),
      prisma.resume.findFirst({
        where: { id: resumeId2, userId: session.user.id },
      }),
    ]);

    if (!resume1 || !resume2) {
      return NextResponse.json(
        {
          success: false,
          error: "One or both resumes not found",
        },
        { status: 404 }
      );
    }

    if (!resume1.feedback || !resume2.feedback) {
      return NextResponse.json(
        {
          success: false,
          error: "Both resumes need to be analyzed first",
        },
        { status: 400 }
      );
    }

    // Validate analysis data
    const analysis1 = safeValidateAnalysis(resume1.feedback);
    const analysis2 = safeValidateAnalysis(resume2.feedback);

    if (!analysis1 || !analysis2) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analysis data in one or both resumes",
        },
        { status: 400 }
      );
    }

    // Perform comparison
    const comparison = ComparisonEngine.compareResumes(analysis1, analysis2);

    return NextResponse.json({
      success: true,
      comparison,
      resume1: { fileName: resume1.fileName, score: analysis1.score },
      resume2: { fileName: resume2.fileName, score: analysis2.score },
    });
  } catch (error) {
    console.error("Comparison API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Comparison failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
