import { Analysis } from "@/types/resume";

// Type guard function
function isAnalysis(data: unknown): data is Analysis {
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

export function validateAnalysis(data: unknown): Analysis {
  if (isAnalysis(data)) {
    return data;
  }
  throw new Error("Invalid analysis data structure");
}

export function safeValidateAnalysis(data: unknown): Analysis | null {
  return isAnalysis(data) ? data : null;
}
