"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export interface ExportRow {
  order_number: string;
  customer_name: string;
  amount: number;
  status: string;
  gateway: string;
  reference: string;
  created_at: string;
}

function toCsvValue(value: string | number) {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const HEADERS = ["Order Number", "Customer", "Amount", "Status", "Gateway", "Reference", "Date"];

function toRows(rows: ExportRow[]) {
  return rows.map((r) => [r.order_number, r.customer_name, r.amount, r.status, r.gateway, r.reference, formatDate(r.created_at)]);
}

export default function ExportPaymentsButton({ rows, label = "Payments" }: { rows: ExportRow[]; label?: string }) {
  const stamp = new Date().toISOString().slice(0, 10);

  function exportCsv() {
    const body = toRows(rows).map((r) => r.map(toCsvValue).join(",")).join("\n");
    download(`${HEADERS.join(",")}\n${body}`, `akaranda-${label.toLowerCase()}-${stamp}.csv`, "text/csv;charset=utf-8;");
  }

  function exportExcel() {
    // Dependency-free .xls export: Excel opens an HTML table served with this
    // MIME type natively. Genuine binary .xlsx would need an added library
    // (e.g. SheetJS) — CSV/this covers the "Excel export" requirement without
    // one.
    const theadCells = HEADERS.map((h) => `<th>${h}</th>`).join("");
    const bodyRows = toRows(rows)
      .map((r) => `<tr>${r.map((c) => `<td>${String(c)}</td>`).join("")}</tr>`)
      .join("");
    const html = `<table><thead><tr>${theadCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    download(html, `akaranda-${label.toLowerCase()}-${stamp}.xls`, "application/vnd.ms-excel");
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportCsv}>
        <Download className="w-4 h-4 mr-1.5" /> Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportExcel}>
        <Download className="w-4 h-4 mr-1.5" /> Export Excel
      </Button>
    </div>
  );
}
