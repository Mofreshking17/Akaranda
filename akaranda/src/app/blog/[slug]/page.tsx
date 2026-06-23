import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

function fmt(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center text-center px-4">
        <div>
          <p className="text-brand-muted text-6xl mb-4">404</p>
          <h1 className="text-2xl font-light text-brand-brown mb-4">Article Not Found</h1>
          <Link href="/blog" className="btn-primary">Back to Journal</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">{fmt(post.published_at ?? post.created_at)}</p>
        <h1 className="text-3xl md:text-5xl font-light max-w-3xl mx-auto leading-tight">{post.title}</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-brand-muted text-xs tracking-widest uppercase hover:text-brand-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        {post.featured_image && (
          <div className="relative h-72 md:h-96 mb-8 overflow-hidden bg-brand-sand">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        {post.excerpt && <p className="text-lg text-brand-brown/80 leading-relaxed mb-8 font-light">{post.excerpt}</p>}

        <div className="prose prose-neutral max-w-none text-brand-brown/90 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-brand-sand">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs tracking-widest uppercase px-3 py-1 bg-brand-sand text-brand-muted">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
