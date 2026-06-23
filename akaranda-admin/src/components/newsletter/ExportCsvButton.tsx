"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NewsletterSubscriber } from "@/lib/types/database";

export default function ExportCsvButton({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  function exportCsv() {
    const header = "Email,Name,Subscribed At\n";
    const rows = subscribers
      .map((s) => `${s.email},${s.full_name ?? ""},${s.subscribed_at}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `akaranda-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={exportCsv}>
      <Download className="w-4 h-4 mr-1.5" /> Export CSV
    </Button>
  );
}
