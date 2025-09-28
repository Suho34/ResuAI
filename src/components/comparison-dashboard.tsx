"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ComparisonResult } from "@/types/comparison";
import { safeValidateAnalysis } from "@/lib/validation";
import { DashboardResume } from "@/types/resume";
import { ScoreComparison } from "./score-comparison";
import { ChangeList } from "./change-list";
import { SkillsEvolution } from "./skills-evolution";
import { ProgressMetrics } from "./progress-metrics";
import { FiAlertCircle, FiChevronDown, FiTrendingUp } from "react-icons/fi";
import { GitCompare, GitCommitHorizontal } from "lucide-react";
import { MdOutlineCompareArrows } from "react-icons/md";

interface ComparisonDashboardProps {
  resumes: DashboardResume[];
}

export function ComparisonDashboard({ resumes }: ComparisonDashboardProps) {
  const [selectedResume1, setSelectedResume1] = useState<string>("");
  const [selectedResume2, setSelectedResume2] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string>("");

  // Filter resumes that have valid analysis data
  const analyzedResumes = resumes.filter((resume) => {
    return (
      resume.feedback !== null && safeValidateAnalysis(resume.feedback) !== null
    );
  });

  const handleCompare = async () => {
    if (!selectedResume1 || !selectedResume2) {
      setError("Please select two resumes to compare.");
      return;
    }

    if (selectedResume1 === selectedResume2) {
      setError("Please select two different resumes.");
      return;
    }

    setIsComparing(true);
    setError("");
    setComparisonResult(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId1: selectedResume1,
          resumeId2: selectedResume2,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComparisonResult(data.comparison);
      } else {
        setError(data.error || "Comparison failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  const getResumeById = (id: string) => {
    return analyzedResumes.find((r) => r.id === id);
  };

  const getResumeDisplayName = (resume: DashboardResume) => {
    return `${resume.fileName} • v${resume.versionNumber} • ${new Date(
      resume.createdAt
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const renderResumeSelector = (
    selectedValue: string,
    onChange: (value: string) => void,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative">
        <select
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 pl-5 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
        >
          <option value="">{placeholder}</option>
          {analyzedResumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {getResumeDisplayName(resume)}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Resume Selection & Comparison Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-md">
            <MdOutlineCompareArrows className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Compare Resume Versions
            </h2>
            <p className="text-sm text-gray-600">
              Select two versions to track your progress and see improvements.
            </p>
          </div>
        </div>

        {/* Comparison Setup */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-6">
          <div className="w-full">
            {renderResumeSelector(
              selectedResume1,
              setSelectedResume1,
              "Original Resume",
              "Select the older version..."
            )}
          </div>
          <div className="hidden lg:flex flex-col items-center gap-1 text-gray-400 font-mono text-sm self-center pt-6">
            <GitCommitHorizontal className="w-6 h-6 text-gray-300" />
            VS
            <GitCommitHorizontal className="w-6 h-6 text-gray-300" />
          </div>
          <div className="w-full">
            {renderResumeSelector(
              selectedResume2,
              setSelectedResume2,
              "Updated Resume",
              "Select the newer version..."
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <Button
            onClick={handleCompare}
            disabled={isComparing || !selectedResume1 || !selectedResume2}
            className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
          >
            {isComparing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Analyzing Differences...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <GitCompare className="w-5 h-5" />
                Compare Versions
              </span>
            )}
          </Button>
        </div>

        {/* Error & Helper Messages */}
        <div className="mt-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
              <FiAlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-rose-800 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {analyzedResumes.length < 2 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <FiTrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium">More Data Needed</p>
                <p className="text-amber-700 text-sm">
                  Upload and analyze at least two resumes to unlock the
                  comparison tool.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results Section */}
      {comparisonResult && (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-5">
          <ScoreComparison
            resume1={getResumeById(selectedResume1)}
            resume2={getResumeById(selectedResume2)}
            comparison={comparisonResult}
          />
          <ProgressMetrics comparison={comparisonResult} />
          <SkillsEvolution comparison={comparisonResult} />
          <ChangeList changes={comparisonResult.changes} />
        </div>
      )}

      {/* Empty State for Results */}
      {!isComparing && !comparisonResult && analyzedResumes.length >= 2 && (
        <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full mb-6 ring-8 ring-gray-100">
            <MdOutlineCompareArrows className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            Ready to See Your Progress?
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto">
            Select two resume versions from the panel above and click
            &apos;Compare Versions&apos; to generate a detailed analysis of your
            improvements.
          </p>
        </div>
      )}
    </div>
  );
}
