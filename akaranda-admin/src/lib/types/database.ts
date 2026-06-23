export type AdminRole = "super_admin" | "admin" | "content_manager";
export type ProductStatus = "draft" | "published" | "archived";
export type ProductCollection = "kids" | "chics" | "family" | "seasonal";
export type OrderStatus = "pending" | "paid" | "processing" | "ready_for_delivery" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded" | "failed";
export type WardrobeType = "kiddies" | "chics";
export type WardrobeStatus = "new_request" | "in_review" | "styling" | "ready" | "delivered";
export type BlogStatus = "draft" | "scheduled" | "published";
export type MediaKind = "image" | "video";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
}

export interface MediaFile {
  id: string;
  file_name: string;
  storage_path: string;
  url: string;
  kind: MediaKind;
  folder: string;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  collection: ProductCollection;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  available_sizes: string[];
  available_colours: string[];
  fabric_info: string | null;
  care_instructions: string | null;
  delivery_time: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  video_url: string | null;
  status: ProductStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  media_id: string | null;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  total_spend: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  delivery_address: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  selected_size: string | null;
  selected_colour: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface WardrobeRequest {
  id: string;
  type: WardrobeType;
  customer_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  measurements: Record<string, string | number>;
  colour_preferences: string[];
  style_preferences: string | null;
  occasion: string | null;
  budget_range: string | null;
  uploaded_photos: string[];
  status: WardrobeStatus;
  admin_notes: string | null;
  internal_team_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LookbookCollection {
  id: string;
  title: string;
  slug: string;
  collection_group: ProductCollection;
  description: string | null;
  cover_image: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LookbookItem {
  id: string;
  collection_id: string;
  media_id: string | null;
  url: string;
  kind: MediaKind;
  caption: string | null;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  author_id: string | null;
  status: BlogStatus;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  location: string | null;
  customer_photo: string | null;
  rating: number;
  testimonial_text: string;
  related_collection: string | null;
  is_featured: boolean;
  show_on_homepage: boolean;
  sort_order: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  full_name: string | null;
  subscribed_at: string;
  is_active: boolean;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: unknown;
  updated_by: string | null;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}
