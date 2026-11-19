import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type StaffRole = "barber" | "admin";

export type StaffAuthorization =
  | { kind: "authorized"; userId: string; role: StaffRole }
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "error" };

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function getStaffAuthorization(): Promise<StaffAuthorization> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceClient = createServiceRoleClient();

  if (!url || !anonKey || !serviceClient) {
    console.error("Staff authorization is unavailable because Supabase is not configured.");
    return { kind: "error" };
  }

  const cookieStore = cookies();
  const authClient = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      }
    }
  });

  const {
    data: { user },
    error: userError
  } = await authClient.auth.getUser();

  if (userError || !user) {
    return { kind: "unauthenticated" };
  }

  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to read the authenticated user's staff role.", profileError);
    return { kind: "error" };
  }

  if (profile?.role !== "admin" && profile?.role !== "barber") {
    return { kind: "forbidden" };
  }

  return { kind: "authorized", userId: user.id, role: profile.role };
}
