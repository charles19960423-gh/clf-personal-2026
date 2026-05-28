import type { ReactNode } from "react";

type AdminStatCardProps = {
  description?: string;
  label: string;
  value: ReactNode;
};

export function AdminStatCard({
  description,
  label,
  value,
}: AdminStatCardProps) {
  return (
    <article className="border border-zinc-300 p-6">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-4 font-mono text-5xl font-light text-zinc-950">
        {value}
      </p>
      {description ? (
        <p className="mt-5 text-sm leading-7 text-zinc-600">{description}</p>
      ) : null}
    </article>
  );
}
