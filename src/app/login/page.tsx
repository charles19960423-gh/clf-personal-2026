import { redirect } from "next/navigation";
import { LoginForm } from "@/components/site/login-form";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
    reason?: string;
  }>;
};

function normalizeRedirectPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = normalizeRedirectPath(params.redirect);
  const isSupabaseReady = isSupabaseConfigured();

  if (isSupabaseReady) {
    const user = await getCurrentUser();

    if (user) {
      redirect(redirectTo);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-6 py-14 sm:px-10 lg:px-16">
      <section className="grid w-full gap-12 border-y border-zinc-300 py-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
            Admin Auth
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-zinc-950 sm:text-7xl">
            后台登录
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            用于进入林峰系统管理后台。后台写入能力会跟随 Supabase Auth
            session 和 RLS 策略一起生效。
          </p>
        </div>

        <div className="border border-zinc-300 p-6">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-lg font-medium text-zinc-950">LIN FENG SYSTEM</p>
              <p className="mt-1 text-sm text-zinc-500">Management Console</p>
            </div>
            <span className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
              AUTH
            </span>
          </div>

          {params.reason === "supabase-not-configured" ? (
            <p className="mt-6 border border-zinc-300 px-4 py-3 text-sm leading-6 text-zinc-600">
              后台已启用登录保护。当前本地 Supabase 未配置，所以只能查看登录页。
            </p>
          ) : null}

          <LoginForm isSupabaseReady={isSupabaseReady} redirectTo={redirectTo} />
        </div>
      </section>
    </main>
  );
}
