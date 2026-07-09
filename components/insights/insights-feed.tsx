"use client";

import { useMemo, useState } from "react";
import { InsightCard } from "@/components/shared/insight-card";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/lib/mock/types";

const CATEGORIES: (AIInsight["category"] | "All")[] = ["All", "Matching", "Hiring", "Referral", "Skills", "Alumni", "Placement"];
const priorityOrder: Record<AIInsight["priority"], number> = { high: 0, medium: 1, low: 2 };

export function InsightsFeed({ insights }: { insights: AIInsight[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    const list = category === "All" ? insights : insights.filter((i) => i.category === category);
    return [...list].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [insights, category]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === c ? "bg-primary text-primary-foreground" : "border border-border text-foreground/70 hover:bg-accent",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No insights in this category right now.</p>}
      </div>
    </div>
  );
}
