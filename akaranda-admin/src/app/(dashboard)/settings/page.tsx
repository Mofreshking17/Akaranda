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
      <div className="p-6">
        <Tabs defaultValue="brand">
          <TabsList>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="contact">WhatsApp & Social</TabsTrigger>
            <TabsTrigger value="delivery">Delivery & Shipping</TabsTrigger>
            <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          </TabsList>

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
