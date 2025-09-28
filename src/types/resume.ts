// src/types/resume.ts

export interface Analysis {
  strengths: string[];
  missingSkills: string[];
  atsTips: string[];
  improvements: string[];
  score: number;
}

// Create a Prisma-compatible type
export type PrismaAnalysis = {
  strengths: string[];
  missingSkills: string[];
  atsTips: string[];
  improvements: string[];
  score: number;
};

// Helper function to convert Analysis to Prisma-compatible format
export function toPrismaAnalysis(analysis: Analysis): PrismaAnalysis {
  return {
    strengths: analysis.strengths,
    missingSkills: analysis.missingSkills,
    atsTips: analysis.atsTips,
    improvements: analysis.improvements,
    score: analysis.score,
  };
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  rawText: string | null;
  jobRole: string | null;
  feedback: Analysis;
  versionNumber: number;
  isCurrent: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  resumeId?: string;
  fileName?: string;
  textLength?: number;
  preview?: string;
  error?: string;
}

export interface AnalysisResponse {
  success: boolean;
  hasAnalysis: boolean;
  analysis?: Analysis;
  status?: "pending" | "completed" | "failed";
  error?: string;
}

// Type guard
export function isAnalysis(data: unknown): data is Analysis {
  if (!data || typeof data !== "object") return false;

  const analysis = data as Record<string, unknown>;

  return (
    Array.isArray(analysis.strengths) &&
    analysis.strengths.every((item) => typeof item === "string") &&
    Array.isArray(analysis.missingSkills) &&
    analysis.missingSkills.every((item) => typeof item === "string") &&
    Array.isArray(analysis.atsTips) &&
    analysis.atsTips.every((item) => typeof item === "string") &&
    Array.isArray(analysis.improvements) &&
    analysis.improvements.every((item) => typeof item === "string") &&
    typeof analysis.score === "number" &&
    analysis.score >= 0 &&
    analysis.score <= 10
  );
}
export interface DashboardResume {
  id: string;
  fileName: string;
  createdAt: Date;
  feedback: unknown;
  versionNumber: number;
  jobRole?: string | null;
}

// Helper function to convert Prisma resume to DashboardResume
export function toDashboardResume(resume: DashboardResume): DashboardResume {
  return {
    id: resume.id,
    fileName: resume.fileName,
    createdAt: resume.createdAt,
    feedback: resume.feedback,
    versionNumber: resume.versionNumber,
    jobRole: resume.jobRole,
  };
}
