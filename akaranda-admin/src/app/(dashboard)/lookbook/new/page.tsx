import { requireModule } from "@/lib/guard";
import Topbar from "@/components/layout/Topbar";
import LookbookForm from "@/components/lookbook/LookbookForm";
import { createLookbookCollection } from "../actions";

export default async function NewLookbookCollectionPage() {
  await requireModule("lookbook");

  return (
    <div>
      <Topbar title="New Lookbook Collection" />
      <div className="p-4 md:p-6">
        <LookbookForm
          onSubmit={async (values, images) => {
            "use server";
            await createLookbookCollection(values, images.map((url) => ({ url, kind: "image" as const })));
          }}
        />
      </div>
    </div>
  );
}
