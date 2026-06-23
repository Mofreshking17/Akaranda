import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Read-only server client for the public site. We don't manage admin sessions here,
// so cookie writes are no-ops; anon RLS policies govern what is visible.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op: public site is anonymous
        },
      },
    }
  );
}
