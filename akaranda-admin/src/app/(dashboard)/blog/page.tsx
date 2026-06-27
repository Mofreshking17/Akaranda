import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import BlogPostsTable from "@/components/blog/BlogPostsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function BlogPage() {
  await requireModule("blog");
  const supabase = await createClient();
  const { data: posts } = await supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });

  return (
    <div>
      <Topbar title="Blog Management" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/blog/new">
            <Button><Plus className="w-4 h-4 mr-1" /> New Post</Button>
          </Link>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <BlogPostsTable posts={posts ?? []} />
        </div>
      </div>
    </div>
  );
}
