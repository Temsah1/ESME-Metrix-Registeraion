"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  label: string;
  sublabel: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function PhotoUpload({
  label,
  sublabel,
  value,
  onChange,
  error,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    // Check mime type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setUploadError("Only JPEG and PNG formats are accepted.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    setProgress(20);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setProgress(50);

      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        console.error("Photo upload failed:", storageError);
        setUploadError("Upload failed. Please check your connection and try again.");
        setProgress(0);
        return;
      }

      setProgress(85);
      const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);

      onChange(publicUrlData.publicUrl);
      setProgress(100);
    } catch (err) {
      console.error("Photo upload error:", err);
      setUploadError("Upload failed. Please check your connection and try again.");
      setProgress(0);
    } finally {
      setTimeout(() => setUploading(false), 300);
    }
  };

  const handleClear = () => {
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-200">
        {label} <span className="text-[#00C9A7]">*</span>
      </label>
      <span className="text-xs text-slate-400">{sublabel}</span>

      {value ? (
        <div className="relative w-full h-44 rounded-xl border border-[#00C9A7]/40 bg-[#111820] overflow-hidden flex items-center justify-center group">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-[#0A0F14]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-500/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#00C9A7] text-[#0A0F14] text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#00C9A7]/25 hover:border-[#00C9A7]/70 rounded-xl cursor-pointer bg-[#111820]/50 hover:bg-[#111820] transition-all group overflow-hidden">
          {uploading ? (
            <div className="flex flex-col items-center gap-3 p-4">
              <Loader2 className="w-8 h-8 text-[#00C9A7] animate-spin" />
              <div className="w-32 h-1.5 bg-[#0A0F14] rounded-full overflow-hidden border border-[#00C9A7]/20">
                <div
                  className="h-full bg-[#00C9A7] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[#00C9A7]">
                Uploading... {progress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-[#00C9A7]/10 flex items-center justify-center text-[#00C9A7] mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-300">
                <span className="text-[#00C9A7] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-slate-500 mt-1">JPEG or PNG (Max 5MB)</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {(error || uploadError) && (
        <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error || uploadError}
        </span>
      )}
    </div>
  );
}
