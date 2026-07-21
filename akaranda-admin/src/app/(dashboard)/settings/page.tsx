import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import BrandSettingsForm from "@/components/settings/BrandSettingsForm";
import SettingsEditor from "@/components/settings/SettingsEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SettingsPage() {
  await requireModule("settings");
  const supabase = await createClient();
  const { data: rows } = await supabase.from("settings").select("*");

  const find = (key: string) => rows?.find((r) => r.key === key)?.value ?? {};

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-4 md:p-6">
        <Tabs defaultValue="brand">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="w-max min-w-full md:w-fit">
              <TabsTrigger value="brand" className="whitespace-nowrap">Brand</TabsTrigger>
              <TabsTrigger value="contact" className="whitespace-nowrap">WhatsApp & Social</TabsTrigger>
              <TabsTrigger value="business" className="whitespace-nowrap">Business Contact</TabsTrigger>
              <TabsTrigger value="delivery" className="whitespace-nowrap">Delivery & Shipping</TabsTrigger>
              <TabsTrigger value="seo" className="whitespace-nowrap">SEO & Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="brand" className="mt-4">
            <BrandSettingsForm initialValue={find("brand")} />
          </TabsContent>

          <TabsContent value="contact" className="mt-4 space-y-6">
            <SettingsEditor
              settingKey="whatsapp"
              title="WhatsApp Business"
              fields={[
                { name: "number", label: "WhatsApp Number", placeholder: "+234 800 000 0000" },
                { name: "default_message", label: "Default Order Message" },
              ]}
              initialValue={find("whatsapp")}
            />
            <SettingsEditor
              settingKey="social_links"
              title="Social Media Links"
              fields={[
                { name: "instagram", label: "Instagram URL" },
                { name: "facebook", label: "Facebook URL" },
                { name: "tiktok", label: "TikTok URL" },
              ]}
              initialValue={find("social_links")}
            />
          </TabsContent>

          <TabsContent value="business" className="mt-4 space-y-6">
            <SettingsEditor
              settingKey="business_contact"
              title="Business Contact"
              fields={[
                { name: "phone", label: "Business Phone Number", placeholder: "+234 814 001 2132" },
                { name: "whatsapp_number", label: "WhatsApp Number", placeholder: "+234 814 001 2132" },
                { name: "support_email", label: "Support Email", placeholder: "hello@akaranda.com" },
                { name: "business_hours", label: "Business Hours", placeholder: "Monday – Saturday, 9:00 AM – 6:00 PM" },
                { name: "label", label: "WhatsApp Line Label", placeholder: "AKARANDA Support & Sales Line" },
              ]}
              initialValue={find("business_contact")}
            />
          </TabsContent>

          <TabsContent value="delivery" className="mt-4 space-y-6">
            <SettingsEditor
              settingKey="delivery_pricing"
              title="Delivery Pricing"
              fields={[
                { name: "standard_days", label: "Standard Delivery (days)", type: "number" },
                { name: "priority_days", label: "Priority Delivery (days)", type: "number" },
                { name: "express_hours", label: "Express Delivery (hours)", type: "number" },
                { name: "free_delivery_threshold", label: "Free Delivery Threshold (₦)", type: "number" },
              ]}
              initialValue={find("delivery_pricing")}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-4 space-y-6">
            <SettingsEditor
              settingKey="seo"
              title="SEO & Analytics"
              fields={[
                { name: "google_analytics_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
                { name: "facebook_pixel_id", label: "Facebook Pixel ID" },
              ]}
              initialValue={find("seo")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
