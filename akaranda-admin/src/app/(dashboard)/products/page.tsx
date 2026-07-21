import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import ProductsTable from "@/components/products/ProductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; collection?: string }>;
}) {
  await requireModule("products");
  const { q, status, collection } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (q) query = query.ilike("name", `%${q}%`);
  if (status) query = query.eq("status", status);
  if (collection) query = query.eq("collection", collection);

  const { data: products } = await query;

  return (
    <div>
      <Topbar title="Product Management" />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </form>
          <Link href="/products/new" className="sm:shrink-0">
            <Button className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-1" /> New Product</Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <ProductsTable products={products ?? []} />
        </div>
      </div>
    </div>
  );
}
