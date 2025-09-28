"use client";

import { DashboardResume } from "@/types/resume";
import { ComparisonResult } from "@/types/comparison";
import { safeValidateAnalysis } from "@/lib/validation";

interface ScoreComparisonProps {
  resume1: DashboardResume | undefined; // Allow undefined
  resume2: DashboardResume | undefined; // Allow undefined
  comparison: ComparisonResult;
}

export function ScoreComparison({
  resume1,
  resume2,
  comparison,
}: ScoreComparisonProps) {
  // Add safety checks for undefined resumes
  if (!resume1 || !resume2) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="text-center text-gray-500">
          Resume data not available
        </div>
      </div>
    );
  }

  // Safely extract and validate analysis data
  const analysis1 = resume1.feedback
    ? safeValidateAnalysis(resume1.feedback)
    : null;
  const analysis2 = resume2.feedback
    ? safeValidateAnalysis(resume2.feedback)
    : null;

  const score1 = analysis1?.score || 0;
  const score2 = analysis2?.score || 0;
  const improvement = comparison.scoreImprovement;

  const getImprovementColor = (improvement: number) => {
    if (improvement > 1) return "text-green-600";
    if (improvement > 0) return "text-yellow-600";
    return "text-red-600";
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 1) return "🚀";
    if (improvement > 0) return "📈";
    if (improvement === 0) return "➡️";
    return "📉";
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Score Comparison</h3>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Before Score */}
        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {score1.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">Before</div>
          <div className="text-xs text-gray-400 mt-2">
            {resume1?.fileName} (v{resume1?.versionNumber})
          </div>
        </div>

        {/* Improvement */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div
            className={`text-3xl font-bold ${getImprovementColor(improvement)}`}
          >
            {getImprovementIcon(improvement)} {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Improvement</div>
          <div className="text-xs text-blue-600 mt-2">
            {comparison.overallProgress}
          </div>
        </div>

        {/* After Score */}
        <div className="text-center p-4 border-2 border-green-200 rounded-lg bg-green-50">
          <div className="text-2xl font-bold text-green-600">
            {score2.toFixed(1)}
          </div>
          <div className="text-sm text-green-600">After</div>
          <div className="text-xs text-green-500 mt-2">
            {resume2?.fileName} (v{resume2?.versionNumber})
          </div>
        </div>
      </div>

      {/* ATS Improvement */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium text-purple-800">ATS Compatibility</span>
          <span className="text-lg font-bold text-purple-600">
            +{comparison.atsImprovement}%
          </span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, comparison.atsImprovement)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
