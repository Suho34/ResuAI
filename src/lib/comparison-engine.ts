import { Analysis } from "@/types/resume";
import { ComparisonResult, ChangeItem } from "@/types/comparison";

export class ComparisonEngine {
  static compareResumes(
    resume1: Analysis,
    resume2: Analysis
  ): ComparisonResult {
    const scoreImprovement = resume2.score - resume1.score;
    const newSkills = this.findNewSkills(resume1, resume2);
    const removedSkills = this.findRemovedSkills(resume1, resume2);
    const atsImprovement = this.calculateATSImprovement(resume1, resume2);

    return {
      scoreImprovement,
      newSkills,
      removedSkills,
      atsImprovement,
      overallProgress: this.generateProgressText(scoreImprovement),
      sectionBreakdown: this.analyzeSections(resume1, resume2),
      changes: this.generateChangeList(
        resume1,
        resume2,
        scoreImprovement,
        newSkills,
        removedSkills
      ),
    };
  }

  private static findNewSkills(resume1: Analysis, resume2: Analysis): string[] {
    return resume2.strengths.filter(
      (skill) => !resume1.strengths.includes(skill)
    );
  }

  private static findRemovedSkills(
    resume1: Analysis,
    resume2: Analysis
  ): string[] {
    return resume1.strengths.filter(
      (skill) => !resume2.strengths.includes(skill)
    );
  }

  private static calculateATSImprovement(
    resume1: Analysis,
    resume2: Analysis
  ): number {
    // Simple improvement calculation based on score difference
    const baseImprovement = (resume2.score - resume1.score) * 15;
    return Math.max(0, Math.min(100, baseImprovement));
  }

  private static generateProgressText(improvement: number): string {
    if (improvement > 2)
      return "Excellent progress! Significant improvement detected.";
    if (improvement > 0.5) return "Good progress! Steady improvement shown.";
    if (improvement > 0) return "Minor improvements detected.";
    if (improvement === 0) return "No significant changes detected.";
    return "Score decreased. Consider reviewing changes.";
  }

  private static analyzeSections(resume1: Analysis, resume2: Analysis) {
    // Simplified section analysis - you can enhance this later
    return {
      skills: {
        before: resume1.strengths.length,
        after: resume2.strengths.length,
      },
      experience: {
        before: this.estimateExperienceScore(resume1),
        after: this.estimateExperienceScore(resume2),
      },
      education: {
        before: this.estimateEducationScore(resume1),
        after: this.estimateEducationScore(resume2),
      },
    };
  }

  private static estimateExperienceScore(analysis: Analysis): number {
    // Simple estimation based on improvements mentioned
    return analysis.improvements.filter(
      (imp) =>
        imp.toLowerCase().includes("experience") ||
        imp.toLowerCase().includes("project")
    ).length;
  }

  private static estimateEducationScore(analysis: Analysis): number {
    return analysis.improvements.filter(
      (imp) =>
        imp.toLowerCase().includes("education") ||
        imp.toLowerCase().includes("degree")
    ).length;
  }

  private static generateChangeList(
    resume1: Analysis,
    resume2: Analysis,
    scoreImprovement: number,
    newSkills: string[],
    removedSkills: string[]
  ): ChangeItem[] {
    const changes: ChangeItem[] = [];

    // Score change
    if (scoreImprovement !== 0) {
      changes.push({
        type: "score_improvement",
        description: `Overall score ${
          scoreImprovement > 0 ? "increased" : "decreased"
        } by ${Math.abs(scoreImprovement).toFixed(1)} points`,
        impact: Math.abs(scoreImprovement) > 1 ? "high" : "medium",
      });
    }

    // New skills
    newSkills.forEach((skill) => {
      changes.push({
        type: "skill_added",
        description: `Added skill: ${skill}`,
        impact: "medium",
      });
    });

    // Removed skills
    removedSkills.forEach((skill) => {
      changes.push({
        type: "skill_removed",
        description: `Removed skill: ${skill}`,
        impact: "low",
      });
    });

    // ATS improvements
    const atsTipsAdded = resume2.atsTips.filter(
      (tip) => !resume1.atsTips.includes(tip)
    );
    atsTipsAdded.forEach((tip) => {
      changes.push({
        type: "ats_improvement",
        description: `ATS enhancement: ${tip}`,
        impact: "high",
      });
    });

    return changes;
  }
}
