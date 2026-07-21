import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import BlogPostForm from "@/components/blog/BlogPostForm";
import { createBlogPost } from "../actions";

export default async function NewBlogPostPage() {
  await requireModule("blog");
  const supabase = await createClient();
  const { data: categories } = await supabase.from("blog_categories").select("id, name").order("name");

  return (
    <div>
      <Topbar title="New Blog Post" />
      <div className="p-4 md:p-6">
        <BlogPostForm
          categories={categories ?? []}
          onSubmit={async (values) => {
            "use server";
            await createBlogPost(values);
          }}
        />
      </div>
    </div>
  );
}
