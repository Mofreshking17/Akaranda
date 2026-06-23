import { notFound } from "next/navigation";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import ProductForm from "@/components/products/ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("products");
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("product_images").select("url").eq("product_id", id).order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Topbar title={`Edit — ${product.name}`} />
      <div className="p-6">
        <ProductForm
          categories={categories ?? []}
          defaultValues={{
            ...product,
            sale_price: product.sale_price ?? undefined,
            category_id: product.category_id ?? "",
          }}
          defaultImages={(images ?? []).map((i) => i.url)}
          onSubmit={async (values, imageUrls) => {
            "use server";
            await updateProduct(id, values, imageUrls);
          }}
        />
      </div>
    </div>
  );
}
