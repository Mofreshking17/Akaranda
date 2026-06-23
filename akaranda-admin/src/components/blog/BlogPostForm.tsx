"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validation/blog";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MediaPicker from "@/components/media/MediaPicker";

interface Category {
  id: string;
  name: string;
}

export default function BlogPostForm({
  categories,
  defaultValues,
  onSubmit,
}: {
  categories: Category[];
  defaultValues?: Partial<BlogPostFormValues>;
  onSubmit: (values: BlogPostFormValues) => Promise<void>;
}) {
  const [featuredImage, setFeaturedImage] = useState<string[]>(defaultValues?.featured_image ? [defaultValues.featured_image] : []);
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit, setValue, formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { status: "draft", tags: [], ...defaultValues },
  });

  async function submit(values: BlogPostFormValues) {
    setSubmitting(true);
    try {
      await onSubmit({ ...values, featured_image: featuredImage[0] ?? "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 max-w-3xl">
      <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <div>
          <Label>Title</Label>
          <Input {...register("title")} onBlur={(e) => setValue("slug", slugify(e.target.value))} />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea rows={2} {...register("excerpt")} />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea rows={12} {...register("content")} />
          {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-neutral-900">Featured Image</h3>
        <MediaPicker selected={featuredImage} onChange={(urls) => setFeaturedImage(urls.slice(-1))} folder="blog" />
      </section>

      <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-neutral-900">Categorisation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select defaultValue={defaultValues?.category_id ?? ""} onValueChange={(v) => v && setValue("category_id", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              defaultValue={defaultValues?.tags?.join(", ")}
              onChange={(e) => setValue("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-neutral-900">SEO Metadata</h3>
        <div>
          <Label>SEO Title</Label>
          <Input {...register("seo_title")} />
        </div>
        <div>
          <Label>SEO Description</Label>
          <Textarea rows={2} {...register("seo_description")} />
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-neutral-900">Publishing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <Select defaultValue={defaultValues?.status ?? "draft"} onValueChange={(v) => v && setValue("status", v as BlogPostFormValues["status"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Scheduled For</Label>
            <Input type="datetime-local" {...register("scheduled_for")} />
          </div>
        </div>
      </section>

      <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Post"}</Button>
    </form>
  );
}
