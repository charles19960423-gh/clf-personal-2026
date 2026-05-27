import { getSystemByKey } from "@/lib/mock-data";
import type { SystemKey } from "@/types";

type SystemBadgeProps = {
  systemKey: SystemKey;
};

export function SystemBadge({ systemKey }: SystemBadgeProps) {
  const system = getSystemByKey(systemKey);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <span className="flex size-7 items-center justify-center border border-zinc-300 text-sm text-zinc-950">
        {system?.symbol}
      </span>
      {system?.name}
    </span>
  );
}
