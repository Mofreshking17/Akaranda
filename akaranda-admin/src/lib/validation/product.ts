import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  short_description: z.string().optional().or(z.literal("")),
  category_id: z.string().optional().or(z.literal("")),
  collection: z.enum(["kids", "chics", "family", "seasonal"]),
  price: z.number().min(0, "Price must be positive"),
  sale_price: z.number().min(0).optional().nullable(),
  stock_quantity: z.number().int().min(0),
  available_sizes: z.array(z.string()),
  available_colours: z.array(z.string()),
  fabric_info: z.string().optional().or(z.literal("")),
  care_instructions: z.string().optional().or(z.literal("")),
  delivery_time: z.string().optional().or(z.literal("")),
  is_featured: z.boolean(),
  is_new_arrival: z.boolean(),
  is_best_seller: z.boolean(),
  is_limited_edition: z.boolean(),
  video_url: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
