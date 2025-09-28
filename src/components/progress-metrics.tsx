"use client";

import { ComparisonResult } from "@/types/comparison";

interface ProgressMetricsProps {
  comparison: ComparisonResult;
}

export function ProgressMetrics({ comparison }: ProgressMetricsProps) {
  const metrics = [
    {
      label: "Skills Section",
      before: comparison.sectionBreakdown.skills.before,
      after: comparison.sectionBreakdown.skills.after,
      improvement:
        comparison.sectionBreakdown.skills.after -
        comparison.sectionBreakdown.skills.before,
      color: "blue",
    },
    {
      label: "Experience Quality",
      before: comparison.sectionBreakdown.experience.before,
      after: comparison.sectionBreakdown.experience.after,
      improvement:
        comparison.sectionBreakdown.experience.after -
        comparison.sectionBreakdown.experience.before,
      color: "green",
    },
    {
      label: "Education Section",
      before: comparison.sectionBreakdown.education.before,
      after: comparison.sectionBreakdown.education.after,
      improvement:
        comparison.sectionBreakdown.education.after -
        comparison.sectionBreakdown.education.before,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-500" };
      case "green":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          bar: "bg-green-500",
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          bar: "bg-purple-500",
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", bar: "bg-gray-500" };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Section Progress</h3>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const colors = getColorClasses(metric.color);
          const maxValue = Math.max(metric.before, metric.after, 10);
          const beforeWidth = (metric.before / maxValue) * 100;
          const afterWidth = (metric.after / maxValue) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{metric.label}</span>
                <span className={`text-sm font-bold ${colors.text}`}>
                  {metric.improvement > 0 ? "+" : ""}
                  {metric.improvement}
                </span>
              </div>

              <div className="flex space-x-2 items-center">
                <span className="text-xs text-gray-500 w-12">Before</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${beforeWidth}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium w-8">{metric.before}</span>
              </div>

              <div className="flex space-x-2 items-center">
                <span className="text-xs text-gray-500 w-12">After</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${afterWidth}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium w-8">{metric.after}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
