import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import HeroSlidesEditor from "@/components/content/HeroSlidesEditor";
import KeyValueEditor from "@/components/content/KeyValueEditor";
import FaqEditor from "@/components/content/FaqEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ContentPage() {
  await requireModule("content");
  const supabase = await createClient();
  const { data: rows } = await supabase.from("site_content").select("*");

  const find = (section: string, key: string) => rows?.find((r) => r.section === section && r.key === key)?.value;

  const heroSlides = {
    slide_1: find("homepage_hero", "slide_1") ?? {},
    slide_2: find("homepage_hero", "slide_2") ?? {},
    slide_3: find("homepage_hero", "slide_3") ?? {},
  };

  return (
    <div>
      <Topbar title="Website Content Management" />
      <div className="p-6">
        <Tabs defaultValue="hero">
          <TabsList>
            <TabsTrigger value="hero">Homepage Hero</TabsTrigger>
            <TabsTrigger value="brand">Brand Story</TabsTrigger>
            <TabsTrigger value="footer">Footer & Contact</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="mt-4">
            <HeroSlidesEditor slides={heroSlides as never} />
          </TabsContent>

          <TabsContent value="brand" className="mt-4 space-y-6">
            <KeyValueEditor
              section="brand_story"
              contentKey="meet_aranda"
              title="Meet Aranda Section"
              fields={[
                { name: "image", label: "Image URL" },
                { name: "title", label: "Title" },
                { name: "body", label: "Body Text", multiline: true },
              ]}
              initialValue={find("brand_story", "meet_aranda") ?? {}}
            />
          </TabsContent>

          <TabsContent value="footer" className="mt-4 space-y-6">
            <KeyValueEditor
              section="footer"
              contentKey="contact"
              title="Footer Contact Information"
              fields={[
                { name: "phone", label: "Phone Number" },
                { name: "email", label: "Email Address" },
                { name: "address", label: "Address", multiline: true },
              ]}
              initialValue={find("footer", "contact") ?? {}}
            />
          </TabsContent>

          <TabsContent value="policies" className="mt-4 space-y-6">
            <KeyValueEditor
              section="policies"
              contentKey="delivery"
              title="Delivery Policy"
              fields={[{ name: "body", label: "Policy Text", multiline: true }]}
              initialValue={find("policies", "delivery") ?? {}}
            />
            <KeyValueEditor
              section="policies"
              contentKey="refund"
              title="Refund Policy"
              fields={[{ name: "body", label: "Policy Text", multiline: true }]}
              initialValue={find("policies", "refund") ?? {}}
            />
          </TabsContent>

          <TabsContent value="faqs" className="mt-4">
            <FaqEditor initialFaqs={find("faqs", "list") ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
