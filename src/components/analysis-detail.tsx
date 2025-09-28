// src/components/analysis-detail.tsx
"use client";

import {
  FiTrendingUp,
  FiAlertCircle,
  FiFileText,
  FiStar,
  FiAward,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";
import { Lightbulb } from "lucide-react";
import { MdOutlineTipsAndUpdates, MdAutoAwesome } from "react-icons/md";

interface Analysis {
  strengths: string[];
  missingSkills: string[];
  atsTips: string[];
  improvements: string[];
  score: number;
}

interface AnalysisDetailProps {
  analysis: Analysis;
}

export function AnalysisDetail({ analysis }: AnalysisDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-emerald-500 to-teal-500";
    if (score >= 6) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-pink-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-50 border-emerald-200";
    if (score >= 6) return "bg-amber-50 border-amber-200";
    return "bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Score Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <FiAward className="w-6 h-6 text-teal-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Resume Analysis Results
              </h1>
            </div>
            <p className="text-gray-600 max-w-md">
              Comprehensive feedback to optimize your resume for better job
              opportunities
            </p>
          </div>

          <div
            className={`relative p-6 rounded-2xl border-2 ${getScoreBg(
              analysis.score
            )} min-w-[140px] text-center`}
          >
            <div
              className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(
                analysis.score
              )} bg-clip-text text-transparent mb-2`}
            >
              {analysis.score}
              <span className="text-2xl text-gray-400">/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                  analysis.score
                )}`}
                style={{ width: `${analysis.score * 10}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200/60 text-center group hover:shadow-md transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <FiCheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analysis.strengths.length}
          </div>
          <div className="text-sm text-gray-600">Strengths</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200/60 text-center group hover:shadow-md transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <FiTarget className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analysis.missingSkills.length}
          </div>
          <div className="text-sm text-gray-600">Skills to Develop</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200/60 text-center group hover:shadow-md transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <MdOutlineTipsAndUpdates className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analysis.improvements.length}
          </div>
          <div className="text-sm text-gray-600">Improvements</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200/60 text-center group hover:shadow-md transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <MdAutoAwesome className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analysis.atsTips.length}
          </div>
          <div className="text-sm text-gray-600">ATS Tips</div>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiTrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-emerald-800 text-lg">
                Key Strengths
              </h3>
              <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {analysis.strengths.length} found
              </span>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start group/item hover:bg-emerald-50/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                    <FiStar className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-slate-700 leading-relaxed">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-800 text-lg">
                Skills to Develop
              </h3>
              <span className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {analysis.missingSkills.length} identified
              </span>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.missingSkills.map((skill, index) => (
                <li
                  key={index}
                  className="flex items-start group/item hover:bg-amber-50/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                    <FiTarget className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-slate-700 leading-relaxed">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Improvements Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-800 text-lg">
                Suggested Improvements
              </h3>
              <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {analysis.improvements.length} suggestions
              </span>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.improvements.map((improvement, index) => (
                <li
                  key={index}
                  className="flex items-start group/item hover:bg-blue-50/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                    <MdOutlineTipsAndUpdates className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-slate-700 leading-relaxed">
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ATS Tips Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiFileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-800 text-lg">
                ATS Optimization
              </h3>
              <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {analysis.atsTips.length} tips
              </span>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.atsTips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start group/item hover:bg-purple-50/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                    <MdAutoAwesome className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
