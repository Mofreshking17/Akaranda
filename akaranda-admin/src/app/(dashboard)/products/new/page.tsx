import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  await requireModule("products");
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div>
      <Topbar title="New Product" />
      <div className="p-6">
        <ProductForm
          categories={categories ?? []}
          onSubmit={async (values, imageUrls) => {
            "use server";
            await createProduct(values, imageUrls);
          }}
        />
      </div>
    </div>
  );
}
