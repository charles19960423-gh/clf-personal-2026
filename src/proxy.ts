import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function redirectToLogin(request: NextRequest, reason?: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  if (reason) {
    loginUrl.searchParams.set("reason", reason);
  }

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/login";

  if (!isAdminPath && !isLoginPath) {
    return NextResponse.next();
  }

  if (!hasSupabaseEnv()) {
    if (isAdminPath) {
      return redirectToLogin(request, "supabase-not-configured");
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath && !user) {
    return redirectToLogin(request);
  }

  if (isLoginPath && user) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/admin";
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = redirectTo.startsWith("/") ? redirectTo : "/admin";
    targetUrl.search = "";

    return NextResponse.redirect(targetUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
