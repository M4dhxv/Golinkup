"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Briefcase, Share2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/lib/mock/types";

type NotificationItem = {
  id: string;
  icon: typeof Sparkles;
  title: string;
  detail: string;
  time: string;
  href: string;
  read: boolean;
};

export function NotificationCenter({ insights }: { insights: AIInsight[] }) {
  const initial: NotificationItem[] = useMemo(
    () => [
      ...insights.slice(0, 4).map((i) => ({
        id: i.id,
        icon: Sparkles,
        title: i.title,
        detail: i.detail,
        time: i.createdAgo,
        href: i.actionHref,
        read: false,
      })),
      { id: "n1", icon: Briefcase, title: "12 new roles posted this week", detail: "Across Google, Meta, and Stripe.", time: "4h ago", href: "/roles", read: false },
      { id: "n2", icon: Share2, title: "3 new successful referrals", detail: "Alumni at Bloomberg and NVIDIA closed referrals.", time: "1d ago", href: "/analytics/referral-intelligence", read: true },
      { id: "n3", icon: UserCheck, title: "47 alumni activated this week", detail: "Activation rate climbed to 68%.", time: "2d ago", href: "/alumni", read: true },
    ],
    [insights],
  );

  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? items.filter((i) => !i.read) : items;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium", filter === "all" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium", filter === "unread" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent")}
          >
            Unread ({items.filter((i) => !i.read).length})
          </button>
        </div>
        <button onClick={() => setItems((its) => its.map((i) => ({ ...i, read: true })))} className="text-sm font-semibold text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {filtered.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.href}
              onClick={() => setItems((its) => its.map((i) => (i.id === n.id ? { ...i, read: true } : i)))}
              className={cn("flex items-start gap-3 px-5 py-4 hover:bg-accent/40", !n.read && "bg-tint-blue-bg/20")}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tint-purple-bg text-tint-purple-fg">
                <Icon className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-tint-blue-fg" />}
            </Link>
          );
        })}
        {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>}
      </div>
    </div>
  );
}
