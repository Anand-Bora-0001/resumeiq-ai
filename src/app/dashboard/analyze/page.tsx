"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(f.type)) {
        toast.error("Please upload a PDF or DOCX file.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB.");
        return;
      }
      setFile(f);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume file.");
      return;
    }
    if (jobDescription.trim().length < 20) {
      toast.error("Please enter a job description (at least 20 characters).");
      return;
    }

    // Demo Mode Alert
    window.alert(
      "Demo Mode: No OpenAI key is connected. The AI analysis will be skipped and the system will instantly generate the same mocked 'perfect' dashboard results for this file to ensure a flawless presentation."
    );

    setIsAnalyzing(true);

    try {
      // Step 1: Upload file
      setUploadProgress("Uploading resume...");
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const { resumeText, fileUrl } = await uploadRes.json();

      // Step 2: Analyze
      setUploadProgress("Analyzing with AI... This may take 15-30 seconds.");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription.trim(),
          jobTitle: jobTitle.trim() || undefined,
          fileName: file.name,
          fileUrl: fileUrl || "",
        }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "Analysis failed");
      }

      const { reviewId } = await analyzeRes.json();
      toast.success("Analysis complete!");
      router.push(`/dashboard/reviews/${reviewId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyze Resume</h1>
        <p className="text-muted-foreground mt-1">
          Upload your resume and paste the job description to get AI-powered
          feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            Resume File
          </h2>

          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-indigo-500 bg-indigo-500/5"
                : file
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
            }`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <FileText className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Upload className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF or DOCX, max 10MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Job Details
          </h2>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Job Title (optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Job Description *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {jobDescription.length} characters
              {jobDescription.length < 20 && jobDescription.length > 0 && (
                <span className="text-amber-400"> (min 20)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !file || jobDescription.trim().length < 20}
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-10 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Resume
            </>
          )}
        </button>

        {uploadProgress && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            {uploadProgress}
          </motion.p>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground max-w-md text-center">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Your resume data is encrypted and stored securely. Analysis
            typically takes 15-30 seconds depending on document length.
          </span>
        </div>
      </div>
    </div>
  );
}
