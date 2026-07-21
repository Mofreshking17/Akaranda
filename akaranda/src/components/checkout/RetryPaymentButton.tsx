"use client";

import { useState } from "react";
import { retryPayment } from "@/app/actions/checkout";

export default function RetryPaymentButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setLoading(true);
    setError(null);
    const callbackUrl = `${window.location.origin}/checkout/callback`;
    const res = await retryPayment(orderNumber, callbackUrl);
    if (res.ok) {
      window.location.href = res.authorizationUrl;
      return;
    }
    setError(res.message);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleRetry} disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Redirecting to Paystack..." : "Retry Payment"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
