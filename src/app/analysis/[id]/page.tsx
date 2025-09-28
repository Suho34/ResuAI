import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AnalysisDetail } from "@/components/analysis-detail";
import Link from "next/link";
import { safeValidateAnalysis } from "@/lib/validation";

// Update the interface to use Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

// Use async component that awaits params
export default async function AnalysisPage(props: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Await the params promise
  const params = await props.params;
  const resumeId = params.id;

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: session.user.id,
    },
  });

  if (!resume) {
    redirect("/dashboard");
  }

  // Validate the feedback data
  const analysis = resume.feedback
    ? safeValidateAnalysis(resume.feedback)
    : null;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2">Analysis: {resume.fileName}</h1>
        <p className="text-gray-600">
          Target role: {resume.jobRole} • Analyzed:{" "}
          {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>

      {analysis ? (
        <AnalysisDetail analysis={analysis} />
      ) : resume.feedback ? (
        <div className="p-4 border rounded-lg bg-red-50">
          <div className="text-red-800">
            <div className="font-semibold">Invalid Analysis Data</div>
            <div className="text-sm mt-1">
              The analysis data is corrupted or in an unexpected format.
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analysis in progress...</p>
        </div>
      )}
    </div>
  );
}
