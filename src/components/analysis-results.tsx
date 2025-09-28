// src/components/analysis-results.tsx - UPDATED VERSION
"use client";

import { useState, useEffect } from "react";
import { AnalysisProgress } from "./analysis-progress";
import { AnalysisDetail } from "./analysis-detail";
import { validateAnalysis } from "@/lib/validation";

interface Analysis {
  strengths: string[];
  missingSkills: string[];
  atsTips: string[];
  improvements: string[];
  score: number;
}

interface AnalysisResultsProps {
  resumeId: string;
}

type AnalysisState = "loading" | "progress" | "complete" | "error";

export function AnalysisResults({ resumeId }: AnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [state, setState] = useState<AnalysisState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Initial check - see if analysis is already complete
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const response = await fetch(`/api/analyze/${resumeId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.hasAnalysis && data.analysis) {
            // Analysis is already complete
            setAnalysis(data.analysis);
            setState("complete");
          } else {
            // Analysis is still in progress, show progress indicator
            setState("progress");
          }
        } else {
          setState("error");
          setError("Failed to check analysis status");
        }
      } catch {
        setState("error");
        setError("Network error checking analysis status");
      }
    };

    checkInitialStatus();
  }, [resumeId]);

  // Update the handleAnalysisComplete function
  const handleAnalysisComplete = (analysisData: unknown) => {
    try {
      const validatedAnalysis = validateAnalysis(analysisData);
      setAnalysis(validatedAnalysis);
      setState("complete");
      setError(null);
    } catch {
      setState("error");
      setError("Invalid analysis data received");
    }
  };
  const handleAnalysisError = (errorMsg: string) => {
    setState("error");
    setError(errorMsg);
  };

  // Show different UI based on current state
  switch (state) {
    case "loading":
      return (
        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Checking analysis status...</span>
          </div>
        </div>
      );

    case "progress":
      return (
        <div className="space-y-4">
          <AnalysisProgress
            resumeId={resumeId}
            onComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />

          <div className="p-4 border rounded-lg bg-orange-50">
            <div className="flex items-center text-sm text-orange-800">
              <span className="mr-2">⏳</span>
              <span>
                Analysis in progress. This page will update automatically when
                complete. You can leave this page and come back later.
              </span>
            </div>
          </div>
        </div>
      );

    case "error":
      return (
        <div className="p-6 border rounded-lg bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <span className="text-lg">❌</span>
            <div>
              <div className="font-semibold">Analysis Error</div>
              <div className="text-sm mt-1">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        </div>
      );

    case "complete":
      return analysis ? (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="flex items-center space-x-2 text-green-800">
              <span className="text-lg">✅</span>
              <span className="font-semibold">Analysis Complete!</span>
            </div>
          </div>
          <AnalysisDetail analysis={analysis} />
        </div>
      ) : (
        <div className="p-6 border rounded-lg bg-yellow-50">
          <div className="text-yellow-800">Analysis data not available.</div>
        </div>
      );

    default:
      return null;
  }
}
