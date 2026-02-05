"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// generated
import { Resume } from "@/generated/prisma/browser";

// actions
import { uploadResume } from "@/actions/job-seeker/upload-resume";

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 3rd party
import { useMutation } from "@tanstack/react-query";
import {
  Upload,
  Loader2,
  AlertCircle,
  FileText,
  Download,
  TriangleAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// ----------------------------------------
// Types
// ----------------------------------------
interface UploadResumeProps {
  resume: Resume | undefined;
}

// ----------------------------------------
// Helpers
// ----------------------------------------
const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const VALID_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024;

// ----------------------------------------
// Component
// ----------------------------------------
export function UploadResume({ resume }: UploadResumeProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // ----------------------------------------
  // File validation
  // ----------------------------------------
  const validateFile = (file: File): boolean => {
    if (!VALID_TYPES.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed");
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  // ----------------------------------------
  // Drag & Drop handlers
  // ----------------------------------------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  // ----------------------------------------
  // TanStack Mutation
  // ----------------------------------------
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (file: File) => {
      const base64 = await new Promise<string>((resolve, reject) => {
        // 👉 Takes a File object
        // 👉 Reads it in the browser
        // 👉 Converts it into Base64 text
        // 👉 Returns only the Base64 data (without metadata)
        const reader = new FileReader(); // browser api
        reader.readAsDataURL(file);

        reader.onload = () => resolve((reader.result as string).split(",")[1]);

        reader.onerror = () => reject(new Error("Failed to read file"));
      });

      return uploadResume(base64, file.name);
    },

    onSuccess: (response) => {
      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Resume uploaded successfully");
      setFile(null);

      // router.refresh();

      if (callbackUrl) {
        router.push(callbackUrl);
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Upload failed. Please try again.");
    },
  });

  // ----------------------------------------
  // Submit handler
  // ----------------------------------------
  const handleUpload = () => {
    if (!file) return;
    mutate(file);
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Upload Resume</CardTitle>
        <CardDescription>
          Upload your resume to apply for jobs (PDF, DOC, DOCX – Max 5MB)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Existing Resume */}
        {resume && (
          <Alert>
            <AlertDescription>
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="font-medium text-brand">{resume.fileName}</p>
                  {resume.fileSize && (
                    <p className="text-sm">{formatFileSize(resume.fileSize)}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  onClick={() => window.open(resume.url, "_blank")}
                  className="bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand rounded-md"
                  aria-label="download resume"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Mutation Error */}
        {isError && (
          <Alert className="border-none bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-500">
            <AlertCircle />
            <AlertDescription>{(error as Error)?.message}</AlertDescription>
          </Alert>
        )}

        {/* Replace Warning */}
        {resume && file && (
          <Alert className="border-none bg-amber-100 text-amber-600 dark:bg-amber-950 darK:text-amber-500">
            <TriangleAlert />
            <AlertDescription className="text-amber-600 darK:text-amber-500">
              Your resume will be replaced with a new one
            </AlertDescription>
          </Alert>
        )}

        {/* Dropzone */}
        {!file && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-brand bg-brand/5"
                : "border-muted-foreground/25 hover:border-brand/50"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="resume-input"
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files[0])
              }
              disabled={isPending}
            />
            <label htmlFor="resume-input" className="cursor-pointer">
              <Upload className="mx-auto mb-3 h-5 w-5 text-slate-600 dark:text-muted-foreground" />
              <p className="font-semibold text-sm">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-slate-600 dark:text-muted-foreground mt-2">
                PDF, DOC, DOCX up to 5MB
              </p>
            </label>
          </div>
        )}

        {/* Selected File */}
        {file && !isPending && (
          <div className="border rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-brand/10 border border-brand/20 text-brand">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-slate-600 dark:text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              size="icon"
              onClick={() => setFile(null)}
              className="border bg-red-100 text-red-600 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:text-red-500 dark:hover:bg-red-950 dark:border-red-800 rounded-md"
              aria-label="remove selected file"
            >
              <Trash2 />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || isPending}
          className="w-full bg-brand hover:bg-brand-hover"
          aria-label={isPending ? "uploading" : "upload resume"}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              {/* <Upload className="mr-2 h-4 w-4" /> */}
              Upload Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
