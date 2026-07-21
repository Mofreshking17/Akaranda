"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { issueRefund, verifyPaymentAgain } from "@/app/(dashboard)/payments/actions";

export function AutoPrint({ shouldPrint }: { shouldPrint: boolean }) {
  useEffect(() => {
    if (shouldPrint) {
      const id = requestAnimationFrame(() => window.print());
      return () => cancelAnimationFrame(id);
    }
  }, [shouldPrint]);
  return null;
}

export function PrintButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer className="w-4 h-4 mr-1.5" /> Print Receipt
    </Button>
  );
}

export function VerifyAgainButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await verifyPaymentAgain(paymentId);
      toast.success(`Verification result: ${res.status}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={run} disabled={busy}>
      {busy ? "Verifying..." : "Verify Again"}
    </Button>
  );
}

export function RefundButton({ paymentId, disabled }: { paymentId: string; disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    const reason = window.prompt("Reason for this refund (visible in the audit log):");
    if (reason === null) return;
    setBusy(true);
    try {
      await issueRefund(paymentId, reason || "No reason provided");
      toast.success("Payment marked as refunded");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Refund failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" size="sm" className="text-red-600" onClick={run} disabled={busy || disabled}>
      {busy ? "Processing..." : "Issue Refund"}
    </Button>
  );
}
