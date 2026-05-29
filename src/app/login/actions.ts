"use server";

import { redirect } from "next/navigation";
import { signInWithEmailPassword, signOutCurrentUser } from "@/lib/supabase/auth";

export type LoginActionState = {
  message: string;
};

function getRedirectPath(value: FormDataEntryValue | null) {
  const redirectTo = String(value ?? "/admin");

  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/admin";
  }

  return redirectTo;
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getRedirectPath(formData.get("redirectTo"));

  if (!email || !password) {
    return {
      message: "请输入邮箱和密码。",
    };
  }

  const result = await signInWithEmailPassword(email, password);

  if (result.error) {
    return {
      message: result.error,
    };
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  await signOutCurrentUser();
  redirect("/login");
}
