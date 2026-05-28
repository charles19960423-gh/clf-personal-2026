import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function AdminActionButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: AdminActionButtonProps) {
  const variantClass =
    variant === "primary"
      ? "border-zinc-950 bg-zinc-950 text-white hover:bg-transparent hover:text-zinc-950"
      : "border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white";

  return (
    <button
      className={[
        "w-fit border px-4 py-2 text-sm transition-colors",
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
