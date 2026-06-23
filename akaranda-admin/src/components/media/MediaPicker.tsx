"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMediaFile } from "@/lib/media-upload";

export default function MediaPicker({
  selected,
  onChange,
  folder = "general",
}: {
  selected: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadMediaFile(file, folder);
        uploaded.push(url);
      }
      onChange([...selected, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(selected.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {selected.map((url) => (
          <div key={url} className="relative h-28 rounded-md overflow-hidden border border-neutral-200 group">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        {uploading ? "Uploading..." : "Upload Images"}
      </Button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
