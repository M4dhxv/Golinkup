import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AttentionCard({
  icon: Icon,
  value,
  label,
  tag,
  actionLabel,
  href,
  tint = "amber",
  urgent = false,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tag?: string;
  actionLabel: string;
  href: string;
  tint?: "amber" | "blue" | "green";
  urgent?: boolean;
}) {
  const tintClasses = {
    amber: "bg-tint-amber-bg text-tint-amber-fg",
    blue: "bg-tint-blue-bg text-tint-blue-fg",
    green: "bg-tint-green-bg text-tint-green-fg",
  }[tint];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card p-5",
        urgent ? "border-tint-amber-fg/40" : "border-border",
      )}
    >
      <span className={cn("flex size-9 items-center justify-center rounded-full", tintClasses)}>
        <Icon className="size-4.5" strokeWidth={2} />
      </span>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {tag && (
        <span className="w-fit rounded-full bg-tint-amber-bg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-tint-amber-fg">
          {tag}
        </span>
      )}
      <Link href={href} className="mt-auto flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        {actionLabel} <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
