import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/data";
import Reveal, { RevealItem } from "@/components/ui/Reveal";

function fmt(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

function categoryName(post: { blog_categories?: { name: string } | { name: string }[] | null }) {
  const c = Array.isArray(post.blog_categories) ? post.blog_categories[0] : post.blog_categories;
  return c?.name ?? "Journal";
}

export default async function StyleJournal() {
  const posts = await getBlogPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="section-subtitle">Fashion & Lifestyle</p>
          <h2 className="section-title">AKARANDA Style Journal</h2>
        </Reveal>
        <Reveal stagger staggerGap={0.1} className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-52 overflow-hidden mb-4 bg-brand-sand">
                  {post.featured_image && (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-luxe"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <p className="text-brand-secondary text-[10px] tracking-widest uppercase mb-2">
                  {categoryName(post)} · {fmt(post.published_at ?? post.created_at)}
                </p>
                <h3 className="text-brand-brown font-medium text-base leading-snug group-hover:text-brand-primary transition-colors duration-300 mb-2">{post.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{post.excerpt}</p>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
        <div className="text-center mt-10">
          <Link href="/blog" className="btn-secondary">Read More Articles</Link>
        </div>
      </div>
    </section>
  );
}
