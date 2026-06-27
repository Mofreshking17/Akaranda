"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { saveSiteContent } from "@/app/(dashboard)/content/actions";

interface Faq {
  question: string;
  answer: string;
}

export default function FaqEditor({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs.length ? initialFaqs : [{ question: "", answer: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(i: number, field: keyof Faq, value: string) {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  }

  function remove(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    try {
      await saveSiteContent("faqs", "list", faqs.filter((f) => f.question.trim()));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-medium text-foreground">Frequently Asked Questions</h3>
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-md p-4 space-y-2 relative">
          <Input placeholder="Question" value={faq.question} onChange={(e) => update(i, "question", e.target.value)} />
          <Textarea rows={2} placeholder="Answer" value={faq.answer} onChange={(e) => update(i, "answer", e.target.value)} />
          <button type="button" onClick={() => remove(i)} className="absolute top-3 right-3 text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])}>
          <Plus className="w-4 h-4 mr-1" /> Add FAQ
        </Button>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved âœ“" : "Save FAQs"}
        </Button>
      </div>
    </section>
  );
}
