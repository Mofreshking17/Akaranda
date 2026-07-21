import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function TestimonialsPage() {
  await requireModule("testimonials");
  const supabase = await createClient();
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <Topbar title="Testimonial Management" />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/testimonials/new">
            <Button><Plus className="w-4 h-4 mr-1" /> Add Testimonial</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(testimonials ?? []).map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
          {(testimonials ?? []).length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-16">No testimonials yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
