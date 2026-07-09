import Link from "next/link";
import { ArrowRight, Target, TrendingUp, Share2, Brain, Users, Award } from "lucide-react";
import type { AIInsight } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const categoryIcon: Record<AIInsight["category"], typeof Target> = {
  Matching: Target,
  Hiring: TrendingUp,
  Referral: Share2,
  Skills: Brain,
  Alumni: Users,
  Placement: Award,
};

const priorityClasses: Record<AIInsight["priority"], string> = {
  high: "bg-tint-rose-bg text-tint-rose-fg",
  medium: "bg-tint-amber-bg text-tint-amber-fg",
  low: "bg-tint-blue-bg text-tint-blue-fg",
};

export function InsightCard({ insight }: { insight: AIInsight }) {
  const Icon = categoryIcon[insight.category];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-tint-purple-bg text-tint-purple-fg">
          <Icon className="size-4.5" strokeWidth={2} />
        </span>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", priorityClasses[insight.priority])}>
          {insight.priority}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{insight.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{insight.detail}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">{insight.createdAgo}</span>
        <Link href={insight.actionHref} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {insight.actionLabel} <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
