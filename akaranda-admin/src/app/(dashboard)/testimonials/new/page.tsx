import { requireModule } from "@/lib/guard";
import Topbar from "@/components/layout/Topbar";
import TestimonialForm from "@/components/testimonials/TestimonialForm";
import { createTestimonial } from "../actions";

export default async function NewTestimonialPage() {
  await requireModule("testimonials");

  return (
    <div>
      <Topbar title="Add Testimonial" />
      <div className="p-4 md:p-6">
        <TestimonialForm
          onSubmit={async (values) => {
            "use server";
            await createTestimonial(values);
          }}
        />
      </div>
    </div>
  );
}
