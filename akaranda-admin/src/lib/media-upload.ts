import { createClient } from "@/lib/supabase/client";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "akaranda-media";

export async function uploadMediaFile(file: File, folder: string): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const kind = file.type.startsWith("video") ? "video" : "image";
  await supabase.from("media_files").insert({
    file_name: file.name,
    storage_path: path,
    url: data.publicUrl,
    kind,
    folder,
    size_bytes: file.size,
  });

  return { url: data.publicUrl, path };
}
