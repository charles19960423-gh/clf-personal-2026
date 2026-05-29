import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      error: "Supabase 未配置，暂时无法登录后台。",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    error: error?.message ?? null,
  };
}

export async function signOutCurrentUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
