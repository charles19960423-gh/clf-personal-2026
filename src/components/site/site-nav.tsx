import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/map", label: "认知地图" },
  { href: "/nodes", label: "知识库" },
  { href: "/videos", label: "视频库" },
  { href: "/admin", label: "后台" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <Link
          className="text-sm font-medium uppercase tracking-[0.32em] text-zinc-950"
          href="/"
        >
          Lin Feng System
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500">
          {navItems.map((item) => (
            <Link
              className="transition-colors hover:text-zinc-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
