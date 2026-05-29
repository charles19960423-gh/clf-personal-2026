import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <header className="border-b border-zinc-300 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Admin Console
            </p>
            <p className="mt-2 text-2xl font-medium text-zinc-950">
              林峰系统论后台
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              {user?.email ?? "Supabase Auth 未配置或未登录"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              className="border border-zinc-300 px-4 py-2 text-zinc-600 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              href="/"
            >
              返回前台
            </Link>
            <Link
              className="border border-zinc-950 bg-zinc-950 px-4 py-2 text-white transition-colors hover:bg-transparent hover:text-zinc-950"
              href="/admin"
            >
              返回后台首页
            </Link>
            <form action={logoutAction}>
              <button
                className="border border-zinc-300 px-4 py-2 text-zinc-600 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                type="submit"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>

        <AdminNav />
      </header>

      <div className="py-10">{children}</div>
    </main>
  );
}
