import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().optional().or(z.literal("")),
  content: z.string().min(10, "Content is required"),
  featured_image: z.string().optional().or(z.literal("")),
  category_id: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()),
  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled", "published"]),
  scheduled_for: z.string().optional().or(z.literal("")),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
