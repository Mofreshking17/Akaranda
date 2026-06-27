"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteBlogPost } from "@/app/(dashboard)/blog/actions";
import type { BlogPost } from "@/lib/types/database";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  scheduled: "secondary",
  draft: "outline",
};

export default function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setBusyId(id);
    try {
      await deleteBlogPost(id);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <Link href={`/blog/${p.id}`} className="font-medium text-foreground hover:underline">{p.title}</Link>
            </TableCell>
            <TableCell><Badge variant={STATUS_VARIANT[p.status]} className="capitalize">{p.status}</Badge></TableCell>
            <TableCell className="text-sm text-muted-foreground">{p.tags.join(", ") || "â€”"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{formatDate(p.updated_at)}</TableCell>
            <TableCell>
              <button onClick={() => remove(p.id, p.title)} disabled={busyId === p.id} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
        {posts.length === 0 && (
          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No blog posts yet.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
