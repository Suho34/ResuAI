export interface ComparisonResult {
  scoreImprovement: number;
  newSkills: string[];
  removedSkills: string[];
  atsImprovement: number;
  overallProgress: string;
  sectionBreakdown: {
    skills: { before: number; after: number };
    experience: { before: number; after: number };
    education: { before: number; after: number };
  };
  changes: ChangeItem[];
}

export interface ChangeItem {
  type:
    | "skill_added"
    | "skill_removed"
    | "score_improvement"
    | "ats_improvement";
  description: string;
  impact: "high" | "medium" | "low";
}

export interface CompareRequest {
  resumeId1: string;
  resumeId2: string;
}

export interface CompareResponse {
  success: boolean;
  comparison?: ComparisonResult;
  resume1?: { fileName: string; score: number };
  resume2?: { fileName: string; score: number };
  error?: string;
}
