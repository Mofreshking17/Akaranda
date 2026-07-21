-- ===================================================================
-- PAYMENTS — Paystack (and future gateway) integration
-- ===================================================================

-- 'shipped' sits between ready_for_delivery and delivered in the pipeline.
alter type order_status add value if not exists 'shipped' after 'ready_for_delivery';

alter table orders add column if not exists payment_method text;
alter table orders add column if not exists discount numeric(12,2) not null default 0;
alter table orders add column if not exists paystack_reference text;

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  gateway text not null default 'paystack',
  reference text not null unique,
  transaction_id text,
  amount numeric(12,2) not null,
  currency text not null default 'NGN',
  status payment_status not null default 'pending',
  payment_method text,
  authorization jsonb,
  gateway_response text,
  paid_at timestamptz,
  refunded_at timestamptz,
  refund_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payments_order on payments(order_id);
create index if not exists idx_payments_status on payments(status);
create index if not exists idx_payments_created on payments(created_at desc);

alter table payments enable row level security;

create policy payments_admin_write on payments for all using (current_role_name() in ('super_admin','admin'));

-- ===================================================================
-- Atomic, race-safe stock decrement — prevents overselling when two
-- checkouts for the same low-stock item are verified concurrently.
-- Returns the quantity actually deducted (may be less than requested
-- if stock ran out between checkout start and payment verification).
-- ===================================================================
create or replace function decrement_product_stock(p_product_id uuid, p_quantity int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current int;
  v_deducted int;
begin
  select stock_quantity into v_current from products where id = p_product_id for update;
  if v_current is null then
    return 0;
  end if;

  v_deducted := least(v_current, p_quantity);
  update products set stock_quantity = v_current - v_deducted, updated_at = now() where id = p_product_id;
  return v_deducted;
end;
$$;

comment on function decrement_product_stock is
  'Row-locks the product, deducts min(stock, requested) to avoid negative stock, returns quantity actually deducted so callers can flag partial/oversold fulfillment.';
