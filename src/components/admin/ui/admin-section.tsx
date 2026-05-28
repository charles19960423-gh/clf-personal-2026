import type { ReactNode } from "react";

type AdminSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description: string;
  title: string;
  variant?: "default" | "panel";
};

export function AdminSection({
  children,
  className = "",
  contentClassName = "mt-6",
  description,
  title,
  variant = "default",
}: AdminSectionProps) {
  const variantClass = variant === "panel" ? "border border-zinc-300 p-6" : "";

  return (
    <section className={[variantClass, className].filter(Boolean).join(" ")}>
      <div className="border-b border-zinc-300 pb-5">
        <h2 className="text-2xl font-medium text-zinc-950">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
