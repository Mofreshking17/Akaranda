"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/lib/validation/product";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MediaPicker from "@/components/media/MediaPicker";

interface Category {
  id: string;
  name: string;
}

export default function ProductForm({
  categories,
  defaultValues,
  defaultImages,
  onSubmit,
}: {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues>;
  defaultImages?: string[];
  onSubmit: (values: ProductFormValues, imageUrls: string[]) => Promise<void>;
}) {
  const [images, setImages] = useState<string[]>(defaultImages ?? []);
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit, setValue, formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      collection: "chics",
      status: "draft",
      stock_quantity: 0,
      price: 0,
      is_featured: false,
      is_new_arrival: false,
      is_best_seller: false,
      is_limited_edition: false,
      available_sizes: [],
      available_colours: [],
      ...defaultValues,
    },
  });

  async function submit(values: ProductFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values, images);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Product Name</Label>
            <Input {...register("name")} onBlur={(e) => setValue("slug", slugify(e.target.value))} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...register("slug")} />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <Label>SKU</Label>
            <Input {...register("sku")} placeholder="AKR-CHC-0001" />
          </div>
          <div>
            <Label>Status</Label>
            <Select defaultValue={defaultValues?.status ?? "draft"} onValueChange={(v) => v && setValue("status", v as ProductFormValues["status"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Short Description</Label>
          <Input {...register("short_description")} placeholder="One-line summary shown in listings" />
        </div>
        <div>
          <Label>Full Description</Label>
          <Textarea rows={5} {...register("description")} />
        </div>
      </section>

      {/* Classification */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select defaultValue={defaultValues?.category_id ?? ""} onValueChange={(v) => v && setValue("category_id", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Collection</Label>
            <Select defaultValue={defaultValues?.collection ?? "chics"} onValueChange={(v) => v && setValue("collection", v as ProductFormValues["collection"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kids">AKARANDA Kids</SelectItem>
                <SelectItem value="chics">AKARANDA Chics</SelectItem>
                <SelectItem value="family">Family Collection</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Pricing & Stock</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Price (₦)</Label>
            <Input type="number" step="100" {...register("price", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Sale Price (₦)</Label>
            <Input type="number" step="100" {...register("sale_price", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Stock Quantity</Label>
            <Input type="number" {...register("stock_quantity", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Available Sizes (comma separated)</Label>
            <Input
              defaultValue={defaultValues?.available_sizes?.join(", ")}
              onChange={(e) => setValue("available_sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="S, M, L, XL"
            />
          </div>
          <div>
            <Label>Available Colours (comma separated)</Label>
            <Input
              defaultValue={defaultValues?.available_colours?.join(", ")}
              onChange={(e) => setValue("available_colours", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Terracotta, Gold, Forest Green"
            />
          </div>
        </div>
      </section>

      {/* Fabric & Care */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Fabric, Care & Delivery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Fabric Information</Label>
            <Input {...register("fabric_info")} placeholder="100% premium Ankara cotton" />
          </div>
          <div>
            <Label>Care Instructions</Label>
            <Input {...register("care_instructions")} placeholder="Hand wash cold, line dry" />
          </div>
        </div>
        <div>
          <Label>Delivery Time</Label>
          <Input {...register("delivery_time")} placeholder="3-7 business days" />
        </div>
      </section>

      {/* Media */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Product Images & Video</h3>
        <MediaPicker selected={images} onChange={setImages} folder="products" />
        <div>
          <Label>Product Video URL</Label>
          <Input {...register("video_url")} placeholder="https://..." />
        </div>
      </section>

      {/* Flags */}
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Tags & Visibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "is_featured" as const, label: "Featured Product" },
            { key: "is_new_arrival" as const, label: "New Arrival" },
            { key: "is_best_seller" as const, label: "Best Seller" },
            { key: "is_limited_edition" as const, label: "Limited Edition" },
          ].map((f) => (
            <div key={f.key} className="flex items-center justify-between border border-border rounded-md px-4 py-3">
              <Label className="text-sm">{f.label}</Label>
              <Switch
                defaultChecked={Boolean(defaultValues?.[f.key])}
                onCheckedChange={(checked) => setValue(f.key, checked)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 pb-10">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : defaultValues ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
