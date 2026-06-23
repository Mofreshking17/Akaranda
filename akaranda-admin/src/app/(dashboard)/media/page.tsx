import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import MediaLibraryGrid from "@/components/media/MediaLibraryGrid";
import MediaUploadButton from "@/components/media/MediaUploadButton";
import Link from "next/link";

const FOLDERS = ["general", "products", "lookbook", "blog", "testimonials", "hero", "branding"];

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; q?: string }>;
}) {
  await requireModule("media");
  const { folder = "general", q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("media_files").select("*").eq("folder", folder).order("created_at", { ascending: false });
  if (q) query = query.ilike("file_name", `%${q}%`);
  const { data: files } = await query;

  return (
    <div>
      <Topbar title="Media Library" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white border border-neutral-200 rounded-md p-1">
            {FOLDERS.map((f) => (
              <Link
                key={f}
                href={`/media?folder=${f}`}
                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  folder === f ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {f}
              </Link>
            ))}
          </div>
          <MediaUploadButton folder={folder} />
        </div>

        <form className="flex gap-2">
          <input type="hidden" name="folder" value={folder} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search files..."
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm w-64 outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </form>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <MediaLibraryGrid files={files ?? []} />
        </div>
      </div>
    </div>
  );
}
