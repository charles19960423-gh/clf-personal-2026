"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const adminNavigation = [
  { label: "总览", href: "/admin" },
  { label: "知识节点", href: "/admin/nodes" },
  { label: "视频选题", href: "/admin/videos" },
  { label: "专题", href: "/admin/topics" },
  { label: "标签", href: "/admin/tags" },
  { label: "系统结构", href: "/admin/systems" },
  { label: "Obsidian 内容源", href: "/admin/obsidian" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <header className="border-b border-zinc-300 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Admin Console
            </p>
            <p className="mt-2 text-2xl font-medium text-zinc-950">
              林峰系统论后台
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
          </div>
        </div>

        <nav
          aria-label="后台导航"
          className="mt-6 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0"
        >
          <div className="flex min-w-max gap-2">
            {adminNavigation.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "border px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <div className="py-10">{children}</div>
    </main>
  );
}
