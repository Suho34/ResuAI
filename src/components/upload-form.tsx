"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { AnalysisResults } from "./analysis-results";

interface UploadResult {
  success: boolean;
  message: string;
  resumeId?: string;
  textLength?: number;
}

export function UploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadResult(null);

    if (file.type !== "application/pdf") {
      setUploadResult({
        success: false,
        message: "Please select a PDF file",
      });
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadResult({
        success: false,
        message: "File must be smaller than 4MB",
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult({
      success: true,
      message: `Selected: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadResult({
        success: false,
        message: "Please select a PDF file",
      });
      return;
    }

    if (!jobRole.trim()) {
      setUploadResult({
        success: false,
        message: "Please enter a job role",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobRole", jobRole);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setUploadResult({
            success: true,
            message: `Upload successful! Extracted ${result.textLength} characters of text.`,
            resumeId: result.resumeId,
            textLength: result.textLength,
          });
          setJobRole("");
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setUploadResult({
            success: false,
            message: result.error || "Upload failed",
          });
        }
      } else {
        setUploadResult({
          success: false,
          message: result.error || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error during upload. Please check your connection.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
            Resume Analyzer
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Upload your resume and get instant AI-powered insights
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Job Role Input */}
            <div className="space-y-2">
              <label
                htmlFor="jobRole"
                className="block text-sm font-medium text-slate-700"
              >
                Target Job Role
              </label>
              <input
                id="jobRole"
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                disabled={isUploading}
              />
            </div>

            {/* File Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                  : selectedFile
                  ? "border-green-400 bg-green-50/30"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              } ${
                isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={isUploading}
              />

              <div className="p-8 sm:p-12 text-center">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-slate-900 mb-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {(selectedFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedFile();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full">
                      <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-slate-700 mb-1">
                        {isDragging
                          ? "Drop your file here"
                          : "Upload your resume"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">PDF • Max 4MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile}
              className="w-full py-6 text-base font-medium rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Resume"
              )}
            </Button>

            {/* Result Message */}
            {uploadResult && (
              <div
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  uploadResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {uploadResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      uploadResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {uploadResult.success ? "Success" : "Error"}
                  </p>
                  <p
                    className={`text-sm mt-1 break-words ${
                      uploadResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {uploadResult.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results Section */}
        {uploadResult?.success && uploadResult.resumeId && (
          <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Analysis Results
            </h3>
            {/* AnalysisResults component would go here */}
            <div className="text-slate-600 text-sm">
              <AnalysisResults resumeId={uploadResult.resumeId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
