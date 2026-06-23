import { notFound } from "next/navigation";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import BlogPostForm from "@/components/blog/BlogPostForm";
import { updateBlogPost } from "../actions";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("blog");
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).single(),
    supabase.from("blog_categories").select("id, name").order("name"),
  ]);

  if (!post) notFound();

  return (
    <div>
      <Topbar title={`Edit — ${post.title}`} />
      <div className="p-6">
        <BlogPostForm
          categories={categories ?? []}
          defaultValues={{
            ...post,
            category_id: post.category_id ?? "",
            featured_image: post.featured_image ?? "",
            scheduled_for: post.scheduled_for ?? "",
          }}
          onSubmit={async (values) => {
            "use server";
            await updateBlogPost(id, values);
          }}
        />
      </div>
    </div>
  );
}
