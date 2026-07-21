"use server";

import { orderService, type CheckoutInput } from "@/lib/services/orderService";

export type { CheckoutInput, CheckoutResult } from "@/lib/services/orderService";

export async function initiateCheckout(input: CheckoutInput) {
  return orderService.initiateCheckout(input);
}

export async function retryPayment(orderNumber: string, callbackUrl: string) {
  return orderService.retryPayment(orderNumber, callbackUrl);
}

export async function getOrderByNumber(orderNumber: string) {
  return orderService.getOrderByNumber(orderNumber);
}
