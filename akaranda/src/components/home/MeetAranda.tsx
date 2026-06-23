import Link from "next/link";
import Image from "next/image";
import { getMeetAranda } from "@/lib/data";

const FALLBACK = {
  image: "/images/misc/meet-aranda.jpg",
  title: "Meet Aranda, Our Inspiration",
  body: "AKARANDA Fashion is named after Aranda, whose charm, innocence, and elegance embody the values of everything we create. Her spirit breathes life into every stitch, every pattern, every collection.",
};

export default async function MeetAranda() {
  const data = (await getMeetAranda()) ?? FALLBACK;
  const image = data.image || FALLBACK.image;

  return (
    <section className="bg-brand-brown overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-stretch">
        <div className="relative h-80 md:h-auto min-h-[500px]">
          <Image src={image} alt={data.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="text-brand-secondary text-xs tracking-[0.3em] uppercase">The Face of AKARANDA Kids</span>
            <h3 className="text-white text-3xl font-light mt-1">Aranda</h3>
          </div>
        </div>

        <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-6">{data.title}</h2>
          <p className="text-white/70 leading-relaxed mb-8 whitespace-pre-line">{data.body}</p>
          <Link href="/about" className="btn-gold w-fit">Read Our Story</Link>
        </div>
      </div>
    </section>
  );
}
