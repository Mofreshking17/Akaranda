"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star } from "lucide-react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";
import { archiveProduct, deleteProduct, duplicateProduct, toggleFeatureProduct } from "@/app/(dashboard)/products/actions";
import type { Product } from "@/lib/types/database";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(id: string, fn: () => Promise<void>, successMsg: string) {
    setBusyId(id);
    try {
      await fn();
      toast.success(successMsg);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Collection</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <Link href={`/products/${p.id}`} className="font-medium text-foreground hover:underline">
                {p.name}
              </Link>
              <p className="text-xs text-muted-foreground">{p.sku ?? "No SKU"}</p>
            </TableCell>
            <TableCell className="capitalize">{p.collection}</TableCell>
            <TableCell>
              {formatNaira(p.sale_price ?? p.price)}
              {p.sale_price && <span className="text-xs text-muted-foreground line-through ml-1">{formatNaira(p.price)}</span>}
            </TableCell>
            <TableCell className={p.stock_quantity < 5 ? "text-red-600 font-medium" : ""}>{p.stock_quantity}</TableCell>
            <TableCell><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {p.is_featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                {p.is_new_arrival && <Badge variant="outline" className="text-[10px]">New</Badge>}
                {p.is_best_seller && <Badge variant="outline" className="text-[10px]">Best Seller</Badge>}
                {p.is_limited_edition && <Badge variant="outline" className="text-[10px]">Limited</Badge>}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={busyId === p.id}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted disabled:opacity-50"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/products/${p.id}`)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => run(p.id, () => duplicateProduct(p.id), "Product duplicated")}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => run(p.id, () => toggleFeatureProduct(p.id, !p.is_featured), p.is_featured ? "Removed from featured" : "Product featured")}>
                    {p.is_featured ? "Unfeature" : "Feature"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => run(p.id, () => archiveProduct(p.id, p.status !== "archived"), p.status === "archived" ? "Product restored" : "Product archived")}>
                    {p.status === "archived" ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                        run(p.id, () => deleteProduct(p.id), "Product deleted");
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
              No products yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
