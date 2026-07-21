import { notFound } from "next/navigation";
import Image from "next/image";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import WardrobeStatusSelect from "@/components/wardrobe/WardrobeStatusSelect";
import WardrobeNotes from "@/components/wardrobe/WardrobeNotes";

export default async function WardrobeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("wardrobe");
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase.from("wardrobe_requests").select("*").eq("id", id).single();
  if (!request) notFound();

  const measurements = (request.measurements ?? {}) as Record<string, string | number>;

  return (
    <div>
      <Topbar title={`${request.full_name} — ${request.type} Wardrobe`} />
      <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><span className="text-neutral-500">Name:</span> {request.full_name}</p>
              <p><span className="text-neutral-500">Phone:</span> {request.phone}</p>
              {request.email && <p><span className="text-neutral-500">Email:</span> {request.email}</p>}
              {request.occasion && <p><span className="text-neutral-500">Occasion:</span> {request.occasion}</p>}
              {request.budget_range && <p><span className="text-neutral-500">Budget:</span> {request.budget_range}</p>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Measurements</h3>
            {Object.keys(measurements).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key} className="border border-neutral-100 rounded-md px-3 py-2">
                    <p className="text-neutral-400 text-xs capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No measurements provided.</p>
            )}
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Colours & Preferences</h3>
            <p className="text-sm mb-2"><span className="text-neutral-500">Colours:</span> {request.colour_preferences?.join(", ") || "—"}</p>
            <p className="text-sm whitespace-pre-line"><span className="text-neutral-500">Style preferences:</span> {request.style_preferences || "—"}</p>
          </section>

          {request.uploaded_photos?.length > 0 && (
            <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
              <h3 className="font-medium text-neutral-900 mb-4">Uploaded Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {request.uploaded_photos.map((url: string) => (
                  <div key={url} className="relative h-32 rounded-md overflow-hidden border border-neutral-200">
                    <Image src={url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Status</h3>
            <WardrobeStatusSelect requestId={request.id} status={request.status} />
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Notes</h3>
            <WardrobeNotes
              requestId={request.id}
              initialAdminNotes={request.admin_notes ?? ""}
              initialInternalNotes={request.internal_team_notes ?? ""}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
