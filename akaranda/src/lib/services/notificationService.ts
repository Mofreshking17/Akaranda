import "server-only";

// No ESP (Resend/SMTP) is connected yet — same gap as the admin dashboard's
// order-status emails. These stay as clearly-labeled stubs so wiring a real
// provider later is a one-line change per function, not a checkout rewrite.

export interface OrderEmailContext {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  total: number;
}

export interface PaymentEmailContext extends OrderEmailContext {
  amount: number;
  reference: string;
}

export const notificationService = {
  async sendOrderConfirmation(ctx: OrderEmailContext): Promise<void> {
    if (!ctx.customerEmail) return;
    // TODO: wire Resend/SMTP. For now, log so the flow is observable in server logs.
    console.log(`[notification] order confirmation -> ${ctx.customerEmail} (order ${ctx.orderNumber})`);
  },

  async sendPaymentReceipt(ctx: PaymentEmailContext): Promise<void> {
    if (!ctx.customerEmail) return;
    console.log(`[notification] payment receipt -> ${ctx.customerEmail} (order ${ctx.orderNumber}, ref ${ctx.reference})`);
  },

  async notifyAdminNewOrder(ctx: OrderEmailContext): Promise<void> {
    console.log(`[notification] admin: new order ${ctx.orderNumber} from ${ctx.customerName}`);
  },

  async notifyAdminPaymentReceived(ctx: PaymentEmailContext): Promise<void> {
    console.log(`[notification] admin: payment received for order ${ctx.orderNumber} (₦${ctx.amount})`);
  },
};
