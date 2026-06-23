import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

function fmt(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

function categoryName(post: { blog_categories?: { name: string } | { name: string }[] | null }) {
  const c = Array.isArray(post.blog_categories) ? post.blog_categories[0] : post.blog_categories;
  return c?.name ?? "Journal";
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Fashion & Lifestyle</p>
        <h1 className="text-4xl md:text-5xl font-light">AKARANDA Style Journal</h1>
        <p className="text-white/70 text-sm mt-2">Fashion tips, parenting & style, and African fashion trends</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts.length === 0 && (
          <p className="text-center text-brand-muted py-16">No articles published yet. Check back soon.</p>
        )}

        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="grid md:grid-cols-2 gap-0 bg-white">
              <div className="relative h-72 md:h-auto md:min-h-[320px] overflow-hidden bg-brand-sand">
                {featured.featured_image && (
                  <Image src={featured.featured_image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-brand-secondary text-[10px] tracking-widest uppercase mb-3">{categoryName(featured)} · {fmt(featured.published_at ?? featured.created_at)}</p>
                <h2 className="text-2xl md:text-3xl font-light text-brand-brown group-hover:text-brand-primary transition-colors mb-4 leading-snug">{featured.title}</h2>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="text-brand-primary text-xs tracking-widest uppercase border-b border-brand-primary pb-0.5 inline-block w-fit group-hover:tracking-[0.3em] transition-all">
                  Read Article →
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white">
                <div className="relative h-48 overflow-hidden bg-brand-sand">
                  {post.featured_image && (
                    <Image src={post.featured_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-brand-secondary text-[10px] tracking-widest uppercase mb-2">{categoryName(post)}</p>
                  <h3 className="text-brand-brown font-medium text-base leading-snug group-hover:text-brand-primary transition-colors mb-3">{post.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <p className="text-brand-muted text-xs mt-3">{fmt(post.published_at ?? post.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
