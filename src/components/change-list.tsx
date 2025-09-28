"use client";

interface ChangeListProps {
  changes: Array<{
    type: string;
    description: string;
    impact: "high" | "medium" | "low";
  }>;
}

export function ChangeList({ changes }: ChangeListProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "skill_added":
        return "✅";
      case "skill_removed":
        return "❌";
      case "score_improvement":
        return "📈";
      case "ats_improvement":
        return "🎯";
      default:
        return "📝";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Detailed Changes</h3>

      <div className="space-y-3">
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 border rounded-lg"
          >
            <span className="text-lg">{getTypeIcon(change.type)}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-medium">{change.description}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getImpactColor(
                    change.impact
                  )}`}
                >
                  {change.impact} impact
                </span>
              </div>
            </div>
          </div>
        ))}

        {changes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No significant changes detected between versions.
          </div>
        )}
      </div>
    </div>
  );
}
