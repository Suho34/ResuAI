"use client";

import { ComparisonResult } from "@/types/comparison";

interface SkillsEvolutionProps {
  comparison: ComparisonResult;
}

export function SkillsEvolution({ comparison }: SkillsEvolutionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Skills Evolution</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* New Skills */}
        <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
            <span className="text-lg mr-2">✅</span>
            Skills Added ({comparison.newSkills.length})
          </h4>
          {comparison.newSkills.length > 0 ? (
            <ul className="space-y-2">
              {comparison.newSkills.map((skill: string, index: number) => (
                <li key={index} className="flex items-center text-green-700">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600 text-sm">No new skills added</p>
          )}
        </div>

        {/* Removed Skills */}
        <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
            <span className="text-lg mr-2">❌</span>
            Skills Removed ({comparison.removedSkills.length})
          </h4>
          {comparison.removedSkills.length > 0 ? (
            <ul className="space-y-2">
              {comparison.removedSkills.map((skill: string, index: number) => (
                <li key={index} className="flex items-center text-red-700">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 text-sm">No skills removed</p>
          )}
        </div>
      </div>

      {/* Skills Count Comparison */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {comparison.sectionBreakdown.skills.before}
          </div>
          <div className="text-sm text-blue-600">Skills Before</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {comparison.sectionBreakdown.skills.after}
          </div>
          <div className="text-sm text-green-600">Skills After</div>
        </div>
      </div>
    </div>
  );
}
