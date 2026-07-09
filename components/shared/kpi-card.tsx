import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tint = "green" | "blue" | "amber" | "purple" | "indigo" | "rose";

const tintClasses: Record<Tint, string> = {
  green: "bg-tint-green-bg text-tint-green-fg",
  blue: "bg-tint-blue-bg text-tint-blue-fg",
  amber: "bg-tint-amber-bg text-tint-amber-fg",
  purple: "bg-tint-purple-bg text-tint-purple-fg",
  indigo: "bg-tint-indigo-bg text-tint-indigo-fg",
  rose: "bg-tint-rose-bg text-tint-rose-fg",
};

export function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  tint = "green",
  href,
  highlighted = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  tint?: Tint;
  href?: string;
  highlighted?: boolean;
}) {
  const content = (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors",
        highlighted ? "border-tint-indigo-fg/40 ring-1 ring-tint-indigo-fg/20" : "border-border",
        href && "hover:border-ring cursor-pointer",
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("flex size-8 items-center justify-center rounded-full", tintClasses[tint])}>
          <Icon className="size-4" strokeWidth={2} />
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
