import HeroSlider from "@/components/home/HeroSlider";
import WhyAkaranda from "@/components/home/WhyAkaranda";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import MeetAranda from "@/components/home/MeetAranda";
import StyleJournal from "@/components/home/StyleJournal";
import WardrobeServicesPreview from "@/components/home/WardrobeServicesPreview";
import Testimonials from "@/components/home/Testimonials";
import { getHeroSlides, getHomepageTestimonials } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroSlides, testimonials] = await Promise.all([
    getHeroSlides(),
    getHomepageTestimonials(),
  ]);

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <WhyAkaranda />
      <ShopByCategory />
      <FeaturedCollections />
      <MeetAranda />
      <WardrobeServicesPreview />
      <StyleJournal />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
