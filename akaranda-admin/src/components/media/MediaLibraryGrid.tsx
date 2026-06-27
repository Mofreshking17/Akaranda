"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Copy, Video, Check } from "lucide-react";
import type { MediaFile } from "@/lib/types/database";
import { deleteMediaFile } from "@/app/(dashboard)/media/actions";

export default function MediaLibraryGrid({ files }: { files: MediaFile[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function copyUrl(file: MediaFile) {
    await navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function remove(file: MediaFile) {
    if (!confirm(`Delete "${file.file_name}"?`)) return;
    setBusyId(file.id);
    try {
      await deleteMediaFile(file.id, file.storage_path);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (files.length === 0) {
    return <p className="text-center text-muted-foreground py-16">No files in this folder yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((file) => (
        <div key={file.id} className="group relative border border-border rounded-md overflow-hidden bg-card">
          <div className="relative h-32 bg-muted">
            {file.kind === "image" ? (
              <Image src={file.url} alt={file.file_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground px-2 py-1.5 truncate">{file.file_name}</p>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => copyUrl(file)}
              className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center hover:bg-card"
              title="Copy URL"
            >
              {copiedId === file.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-foreground" />}
            </button>
            <button
              onClick={() => remove(file)}
              disabled={busyId === file.id}
              className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center hover:bg-card"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
