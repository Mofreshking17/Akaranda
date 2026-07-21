import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface StockCheckItem {
  product_id: string | null;
  product_name: string;
  quantity: number;
}

export interface StockShortfall {
  product_id: string;
  product_name: string;
  requested: number;
  available: number;
}

export const inventoryService = {
  /** Pre-payment guard: reject checkout before charging the customer for something unavailable. */
  async validateStock(items: StockCheckItem[]): Promise<StockShortfall[]> {
    const supabase = createAdminClient();
    const shortfalls: StockShortfall[] = [];

    const ids = items.map((i) => i.product_id).filter((id): id is string => Boolean(id));
    if (ids.length === 0) return shortfalls;

    const { data: products } = await supabase.from("products").select("id, stock_quantity").in("id", ids);
    const stockById = new Map((products ?? []).map((p) => [p.id, p.stock_quantity as number]));

    for (const item of items) {
      if (!item.product_id) continue;
      const available = stockById.get(item.product_id) ?? 0;
      if (available < item.quantity) {
        shortfalls.push({ product_id: item.product_id, product_name: item.product_name, requested: item.quantity, available });
      }
    }
    return shortfalls;
  },

  /**
   * Post-payment: atomically decrement stock per line item via the
   * `decrement_product_stock` RPC (row-locked, clamps at zero — never negative).
   * Returns items where the deducted quantity was less than requested, i.e.
   * stock ran out between checkout and payment verification (rare race) —
   * money was already captured, so these are flagged for manual admin
   * follow-up rather than failing the order.
   */
  async decrementForOrder(orderId: string): Promise<StockShortfall[]> {
    const supabase = createAdminClient();
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, product_name, quantity")
      .eq("order_id", orderId);

    const oversold: StockShortfall[] = [];
    for (const item of items ?? []) {
      if (!item.product_id) continue;
      const { data: deducted, error } = await supabase.rpc("decrement_product_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });
      if (error) {
        console.error(`[inventory] failed to decrement stock for product ${item.product_id}:`, error.message);
        continue;
      }
      if ((deducted as number) < item.quantity) {
        oversold.push({
          product_id: item.product_id,
          product_name: item.product_name,
          requested: item.quantity,
          available: deducted as number,
        });
      }
    }
    return oversold;
  },
};
