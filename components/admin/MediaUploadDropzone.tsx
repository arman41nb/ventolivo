"use client";

import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { MediaLibraryAsset } from "@/types";

interface UploadedMediaAsset {
  id: string;
  kind: "image" | "video";
  url: string;
  altText?: string;
  thumbnailUrl?: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaUploadDropzoneProps {
  title: string;
  description: string;
  onUploaded: (assets: MediaLibraryAsset[]) => void;
  multiple?: boolean;
  compact?: boolean;
}

function parseUploadedAsset(asset: UploadedMediaAsset): MediaLibraryAsset {
  return {
    ...asset,
    createdAt: new Date(asset.createdAt),
    updatedAt: new Date(asset.updatedAt),
  };
}

export default function MediaUploadDropzone({
  title,
  description,
  onUploaded,
  multiple = false,
  compact = false,
}: MediaUploadDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
      }

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        assets?: UploadedMediaAsset[];
        error?: string;
      };

      if (!response.ok || !payload.assets) {
        throw new Error(payload.error || "Upload failed");
      }

      onUploaded(payload.assets.map(parseUploadedAsset));

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed",
      );
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    void uploadFiles(files);
  }

  return (
    <div className={compact ? "" : "rounded-[28px] border border-brown/12 bg-white p-6 shadow-sm"}>
      <div className={compact ? "" : "mb-5"}>
        <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
          {title}
        </p>
        <p className="mt-2 text-sm text-text/75">{description}</p>
      </div>

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? "border-brown bg-brown/5"
            : "border-brown/20 bg-cream/35 hover:border-brown/40"
        } ${isUploading ? "cursor-progress opacity-70" : ""}`}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={isUploading}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            void uploadFiles(files);
          }}
          className="sr-only"
        />
        <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown shadow-sm">
          {isUploading ? "Uploading..." : "Open files"}
        </span>
        <p className="mt-4 max-w-md text-sm text-text/80">
          Drop image files here or click to browse.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
          PNG, JPG, WebP, AVIF, GIF, SVG up to 10 MB
        </p>
      </label>

      {error ? (
        <p className="mt-3 rounded-2xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
