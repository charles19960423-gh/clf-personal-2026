"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AdminNav() {
  const pathname = usePathname();

  return (
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
  );
}
