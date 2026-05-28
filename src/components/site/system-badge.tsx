import type { SystemKey } from "@/types";

type SystemBadgeProps = {
  systemKey: SystemKey;
};

export function SystemBadge({ systemKey }: SystemBadgeProps) {
  const system = {
    country: { symbol: "国", name: "国家系统" },
    ethnos: { symbol: "族", name: "族群系统" },
    family: { symbol: "家", name: "家庭系统" },
    enterprise: { symbol: "企", name: "组织系统" },
    human: { symbol: "人", name: "个体系统" },
  }[systemKey];

  return (
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <span className="flex size-7 items-center justify-center border border-zinc-300 text-sm text-zinc-950">
        {system.symbol}
      </span>
      {system.name}
    </span>
  );
}
