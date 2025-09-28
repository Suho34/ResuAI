// src/components/analysis-progress.tsx
"use client";

import { useState, useEffect } from "react";
import { Analysis } from "@/types/resume";

interface AnalysisProgressProps {
  resumeId: string;
  onComplete: (analysis: Analysis) => void;
  onError: (error: string) => void;
}

export function AnalysisProgress({
  resumeId,
  onComplete,
  onError,
}: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting analysis...");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const steps = [
      "Parsing resume structure...",
      "Analyzing skills and experience...",
      "Checking ATS compatibility...",
      "Reviewing language and tone...",
      "Generating personalized feedback...",
      "Finalizing score and recommendations...",
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setStatus(steps[currentStep]);
        setProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      }
    }, 8000); // Change step every 8 seconds

    // Check for completion every 3 seconds
    const checkCompletion = async () => {
      try {
        const response = await fetch(`/api/analyze/${resumeId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.hasAnalysis && data.analysis) {
            clearInterval(stepInterval);
            clearInterval(timer);
            clearInterval(completionInterval);
            onComplete(data.analysis);
          }
        }
      } catch (error) {
        // Continue polling on error
        console.error("Error checking analysis completion:", error);
      }
    };

    const completionInterval = setInterval(checkCompletion, 3000);

    // Timeout after 3 minutes
    const timeout = setTimeout(() => {
      clearInterval(stepInterval);
      clearInterval(completionInterval);
      clearInterval(timer);
      onError("Analysis timed out. Please try again.");
    }, 180000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(completionInterval);
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [resumeId, onComplete, onError]);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
      <div className="text-center mb-4">
        <div className="w-16 h-16 mx-auto mb-3 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🤖</div>
          </div>
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800">AI Resume Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">{status}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Time elapsed: {elapsedTime}s</span>
          <span>Estimated time: 30-60s</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="flex items-center text-sm text-blue-800">
          <span className="mr-2">💡</span>
          <span>
            Our AI is analyzing your resume against industry standards...
          </span>
        </div>
      </div>
    </div>
  );
}
