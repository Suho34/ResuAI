import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/upload-form";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { safeValidateAnalysis } from "@/lib/validation";
import { ComparisonDashboard } from "@/components/comparison-dashboard";
import { DashboardResume, toDashboardResume } from "@/types/resume";

import {
  CloudUpload,
  FileText,
  TrendingUp,
  Activity,
  BarChart2,
  ArrowRight,
} from "lucide-react";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const userResumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const dashboardResumes: DashboardResume[] =
    userResumes.map(toDashboardResume);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 6) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return "from-emerald-500 to-teal-500";
    if (score >= 6) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-2">
              {/* Desktop Title */}
              <h1 className="hidden lg:block text-3xl font-extrabold tracking-tight bg-orange-300 bg-clip-text text-transparent">
                Resume Analysis
              </h1>

              {/* Mobile Tab Bar */}
              <div className="lg:hidden overflow-x-auto">
                <div className="flex gap-3 text-sm font-medium min-w-max px-1">
                  <a
                    href="#recents"
                    className="px-4 py-1.5 rounded-lg bg-gray-900 text-teal-400 hover:bg-gray-800 transition-colors whitespace-nowrap"
                  >
                    Recent Analyses
                  </a>
                  <a
                    href="#comparison"
                    className="px-4 py-1.5 rounded-lg bg-gray-900 text-teal-400 hover:bg-gray-800 transition-colors whitespace-nowrap"
                  >
                    Comparison Tool
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-100/80 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                {userResumes.length} resume{userResumes.length !== 1 ? "s" : ""}{" "}
                analyzed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-10">
        {/* Upload & Recent Analyses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CloudUpload className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Analyze New Resume
              </h2>
            </div>
            <UploadForm />
          </div>

          {/* Recent Analyses Card */}
          <div
            id="recents"
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Recent Analyses
              </h2>
            </div>

            {userResumes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4 opacity-40">📄</div>
                <p className="text-lg font-medium text-gray-600">
                  No resumes analyzed yet.
                </p>
                <p className="text-sm mt-1 text-gray-500">
                  Upload your first resume to get AI feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userResumes.slice(0, 5).map((resume) => {
                  const analysis = resume.feedback
                    ? safeValidateAnalysis(resume.feedback)
                    : null;

                  return (
                    <Link
                      key={resume.id}
                      href={`/analysis/${resume.id}`}
                      className="block p-5 border border-gray-200/60 rounded-xl hover:border-teal-300/50 hover:bg-teal-50/30 transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                              {resume.fileName}
                            </h3>
                            {resume.versionNumber &&
                              resume.versionNumber > 1 && (
                                <span className="text-xs font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                                  v{resume.versionNumber}
                                </span>
                              )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Target:{" "}
                            <span className="font-medium">
                              {resume.jobRole || "Not specified"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(resume.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        {analysis ? (
                          <div className="flex flex-col items-end gap-2">
                            <div
                              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getScoreColor(
                                analysis.score
                              )}`}
                            >
                              {analysis.score}/10
                            </div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(
                                  analysis.score
                                )}`}
                                style={{ width: `${analysis.score * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            Processing...
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}

                {userResumes.length > 5 && (
                  <Link
                    href="/history"
                    className="flex items-center justify-center gap-2 text-teal-600 hover:text-teal-800 text-sm font-medium py-3 group"
                  >
                    View all {userResumes.length} analyses
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Tool Section */}
        {dashboardResumes.length >= 2 && (
          <div id="comparison" className="border-t border-gray-200/60 pt-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Resume Comparison Tool
                </h2>
                <p className="text-gray-600">
                  Compare different versions to track your progress and
                  improvement over time
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium bg-teal-50 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                Track your progress
              </div>
            </div>
            <ComparisonDashboard resumes={dashboardResumes} />
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200/60 rounded-xl px-4 py-3">
                <Activity className="w-5 h-5 text-teal-600" />
                <p className="text-sm text-teal-800 font-medium">
                  <strong>Pro Tip:</strong> Upload updated versions to see
                  improvement impact!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action for Single Resume */}
        {userResumes.length === 1 && (
          <div className="border-t border-gray-200/60 pt-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200/60 rounded-2xl p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                  <BarChart2 className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-800 mb-2">
                  Ready to See Your Progress?
                </h3>
                <p className="text-teal-700 mb-6">
                  Upload an improved version to unlock the comparison tool and
                  visualize your growth!
                </p>
                <div className="flex justify-center items-center gap-4 text-4xl text-teal-500">
                  <span>📊</span>
                  <ArrowRight className="w-8 h-8" />
                  <span>📈</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
