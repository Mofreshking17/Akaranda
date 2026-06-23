"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions/public";

export default function NewsletterForm() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    const res = await subscribeNewsletter(formData);
    setStatus(res);
    setPending(false);
  }

  return (
    <div className="max-w-md mx-auto">
      <form action={action} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
          className="flex-1 px-5 py-3 text-sm bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white"
        />
        <button type="submit" disabled={pending} className="btn-gold whitespace-nowrap disabled:opacity-60">
          {pending ? "..." : "Subscribe"}
        </button>
      </form>
      {status && (
        <p className={`text-sm mt-3 ${status.ok ? "text-white" : "text-red-200"}`}>{status.message}</p>
      )}
    </div>
  );
}
